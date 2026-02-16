#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { exit } from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PLONK_PKG = resolve(ROOT, 'packages/plonk/package.json');
const HOOKS_PKG = resolve(ROOT, 'packages/hooks/package.json');

type Pkg = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
};

try {
  main(process.argv[2]);
} catch (err) {
  console.error(err);
  exit(1);
}

function main(type: string | undefined) {
  if (!type) {
    process.stderr.write('Usage: bump-version.mjs <patch|minor|major|x.y.z>\n');
    process.exit(1);
  }

  const plonkPkg = readJSON(PLONK_PKG);
  invariantPackage(plonkPkg);
  const currentVersion = plonkPkg.version;

  let version: string;

  if (['patch', 'minor', 'major'].includes(type)) {
    version = updateVersion(currentVersion, type);
  } else if (isValidSemver(type)) {
    version = type;
  } else {
    process.stderr.write(`Invalid argument: ${type}\n`);
    process.stderr.write('Usage: bump-version.mjs <patch|minor|major|x.y.z>\n');
    process.exit(1);
  }

  // Update packages/plonk/package.json
  plonkPkg.version = version;
  writeJSON(PLONK_PKG, plonkPkg);

  // Update packages/hooks/package.json (version + pinned @prtcl/plonk dependency)
  const hooksPkg = readJSON(HOOKS_PKG);
  invariantPackage(hooksPkg);
  hooksPkg.version = version;
  if (hooksPkg.dependencies) {
    hooksPkg.dependencies['@prtcl/plonk'] = version;
  }
  writeJSON(HOOKS_PKG, hooksPkg);

  process.stdout.write(version + '\n');
}

function readJSON(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJSON(path: string, obj: Record<string, unknown>) {
  writeFileSync(path, JSON.stringify(obj, null, 2) + '\n');
}

function updateVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);

  switch (type) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'major':
      return `${major + 1}.0.0`;
    default:
      throw new Error(`Unknown bump type: ${type}`);
  }
}

function isValidSemver(version) {
  return /^\d+\.\d+\.\d+$/.test(version);
}

function invariantPackage(value: unknown): asserts value is Pkg {
  if (!value || typeof value !== 'object' || !('version' in value)) {
    process.stderr.write('Invariant package.json');
    process.exit(1);
  }
}
