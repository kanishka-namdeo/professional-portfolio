import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

// Mount-sync effects (theme/storage reads, `mounted` gates that keep SSR
// markup identical before hydration) are intentional here; the new
// react-hooks/set-state-in-effect rule flags them wholesale. Warned, not
// errored, until those patterns get a useSyncExternalStore refactor. Mutated
// in place: flat config forbids re-registering the plugin to override a rule.
const hooksConfig = coreWebVitals.find(
  (config) => config.rules && 'react-hooks/set-state-in-effect' in config.rules,
);
if (hooksConfig) hooksConfig.rules['react-hooks/set-state-in-effect'] = 'warn';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '.kiro/**',
      '.qoder/**',
      '.shots/**',
      '.git/**',
      '.github/**',
      '.vscode/**',
      'public/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // CommonJS tooling (jest config, build scripts) legitimately uses require.
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default eslintConfig;
