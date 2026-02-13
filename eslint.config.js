/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '.kiro/**',
      '.qoder/**',
      '.git/**',
      '.github/**',
      '.vscode/**',
      'public/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];

export default eslintConfig;
