// ESLint 9 flat config. The gateway is CommonJS JavaScript running on Node.
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      // Express identifies error-handling middleware by its arity: a handler
      // must declare (err, req, res, next) or Express treats it as ordinary
      // middleware and error handling silently stops working. So an unused
      // trailing `next` is required, not dead code.
      // `caughtErrors: 'none'` allows `catch (err)` where the error is
      // deliberately not surfaced to the client (see middleware/auth.js).
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
    },
  },
  { ignores: ['node_modules/', 'coverage/'] },
];
