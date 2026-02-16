#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

step() {
  echo -e "${BLUE}→${NC} $1"
}

success() {
  echo -e "${GREEN}✓${NC} $1"
}

warn() {
  echo -e "${YELLOW}!${NC} $1"
}

error() {
  echo -e "${RED}✗${NC} $1" >&2
  exit 1
}

# --- Parse args ---

BUMP_TYPE="patch"
DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --dry) DRY_RUN=true ;;
    patch|minor|major) BUMP_TYPE="$arg" ;;
    *)
      if [[ "$arg" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        BUMP_TYPE="$arg"
      else
        error "Unknown argument: $arg"
      fi
      ;;
  esac
done

if [ -z "$BUMP_TYPE" ]; then
  echo "Usage: publish.sh <patch|minor|major|x.y.z> [--dry]"
  exit 1
fi

# --- Pre-flight checks ---

# --- Bump version ---

step "Bumping version ($BUMP_TYPE)..."
NEW_VERSION=$(tsx "$SCRIPT_DIR/update-version.ts" "$BUMP_TYPE")
success "Version updated to $NEW_VERSION"

# --- Sync lockfile ---

step "Syncing package-lock.json..."
echo ""
npm install

# --- Build ---

step "Building packages..."
echo ""
npm run build

# --- Test ---

step "Running tests..."
echo ""
npm run lint
npm run typecheck
npm run test

# --- Publish or dry-run ---

if [ "$DRY_RUN" = true ]; then
  echo ""
  step "Dry run, skipped commit and publish"
else
  echo ""
  step "Committing and tagging..."
  git add -A
  git commit -m "v$NEW_VERSION"
  git tag "v$NEW_VERSION"
  git push && git push --tags
  success "Committed, tagged, and pushed v$NEW_VERSION"

  step "Publishing packages..."
  npm publish --access=public -ws
fi

echo ""
echo -e "  Version: ${GREEN}$NEW_VERSION${NC}"
success "Packages: @prtcl/plonk@$NEW_VERSION, @prtcl/plonk-hooks@$NEW_VERSION"
echo ""
