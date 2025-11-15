const js = require('@eslint/js');
const cypress = require('eslint-plugin-cypress');
const react = require('eslint-plugin-react');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        node: true,
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'always'],
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'no-useless-escape': 'error',
    },
  },
  // Frontend React files
  {
    files: ['frontend/**/*.js', 'frontend/**/*.jsx'],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: require('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        console: 'readonly',
        process: 'readonly',
        React: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
    },
  },
  // Test files
  {
    files: ['**/*.test.js', '**/tests/**/*.js', '**/test*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        mock: 'readonly',
        mockFn: 'readonly',
        spyOn: 'readonly',
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        fetch: 'readonly',
      },
    },
  },
  // Cypress files
  {
    files: ['cypress/**/*.js'],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        describe: 'readonly',
        context: 'readonly',
        it: 'readonly',
        window: 'readonly',
        document: 'readonly',
      },
    },
    rules: {
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/',
      'src/generated/**',
      'coverage/',
      'dist/',
      '*.min.js',
      'backend/node_modules/',
      'frontend/node_modules/',
      'frontend_old/**', // Ignore the old frontend directory
      'backend/src/generated/**', // Ignore Prisma generated files
      '**/*.generated.js', // Ignore any generated files
      '**/prisma/runtime/**', // Ignore Prisma runtime files
    ],
  },
];
