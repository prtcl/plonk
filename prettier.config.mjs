/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['vitest', 'react', '<THIRD_PARTY_MODULES>', '^~/(.*)$', '^[./]'],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
};
