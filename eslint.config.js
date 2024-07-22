// @ts-check
const globals = require('globals');
// Allows us to bring in the recommended core rules from eslint itself
const eslint = require('@eslint/js');

// Allows us to use the typed utility for our config, and to bring in the recommended rules for TypeScript projects from typescript-eslint
const tseslint = require('typescript-eslint');

// Allows us to bring in the recommended rules for Angular projects from angular-eslint
const angular = require('angular-eslint');

const json = require('eslint-plugin-json');

const ignores = [
    'dist/',
    'tmp/',
    'out-tsc/',
    'bazel-out/',
    'node_modules/',
    '.idea/',
    '.vscode/',
    '.history/',
    '.angular/',
    'coverage/',
    'coverage-ts/',
    'cypress/',
    'package-lock.json',
];

// Export our config array, which is composed together thanks to the typed utility function from typescript-eslint
module.exports = tseslint.config(
    {
        ignores,
    },
    {
        // Everything in this config object targets our TypeScript files (Components, Directives, Pipes etc)
        files: ['**/*.ts'],
        extends: [
            // Apply the recommended core rules
            eslint.configs.recommended,
            // Apply the recommended TypeScript rules
            ...tseslint.configs.recommended,
            // Optionally apply stylistic rules from typescript-eslint that improve code consistency
            ...tseslint.configs.stylistic,
            // Apply the recommended Angular rules
            ...angular.configs.tsRecommended,
        ],
        // Set the custom processor which will allow us to have our inline Component templates extracted
        // and treated as if they are HTML files (and therefore have the .html config below applied to them)
        processor: angular.processInlineTemplates,
        // Override specific rules for TypeScript files (these will take priority over the extended configs above)
        rules: {
            '@angular-eslint/component-selector': [
                'error',
                {
                    prefix: 'jsdaddy',
                    style: 'kebab-case',
                    type: 'element',
                },
            ],
            '@angular-eslint/directive-selector': [
                'error',
                {
                    prefix: ['mask', 'jsdaddy'],
                    style: 'camelCase',
                    type: 'attribute',
                },
            ],
            //     '@typescript-eslint/array-type': ['error'],
            //     '@typescript-eslint/consistent-type-assertions': [
            //         'error',
            //         {
            //             assertionStyle: 'as',
            //         },
            //     ],
            //     '@typescript-eslint/naming-convention': [
            //         'error',
            //         {
            //             selector: 'interface',
            //             format: ['PascalCase'],
            //             custom: {
            //                 regex: '^I[A-Z]',
            //                 match: true,
            //             },
            //         },
            //     ],
            //     '@typescript-eslint/explicit-member-accessibility': ['error'],
            //     'import/no-unresolved': 'off',
            //     'import/no-extraneous-dependencies': 'off',
            //     'import/prefer-default-export': 'off',
            //     'no-underscore-dangle': 'off',
            //     'class-methods-use-this': 'off',
            //     'lines-between-class-members': 'off',
            //     'no-return-assign': 'off',
            //     'no-param-reassign': [
            //         'error',
            //         {
            //             props: false,
            //         },
            //     ],
            //     'no-plusplus': ['off'],
            //     '@typescript-eslint/no-unused-vars': [
            //         'error',
            //         {
            //             argsIgnorePattern: '^_',
            //         },
            //     ],
            //     '@typescript-eslint/unbound-method': 'off',
            //     'import/no-cycle': 'off',
            //     'import/extensions': 'off',
        },
    },
    {
        // Everything in this config object targets our HTML files (external templates,
        // and inline templates as long as we have the `processor` set on our TypeScript config above)
        files: ['**/*.html'],
        extends: [
            // Apply the recommended Angular template rules
            ...angular.configs.templateRecommended,
            // Apply the Angular template rules which focus on accessibility of our apps
            ...angular.configs.templateAccessibility,
        ],
        rules: {},
    },
    {
        files: ['**/*.js'],
        extends: [eslint.configs.recommended],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
        rules: {},
    },
    {
        files: ['**/*.json'],
        extends: [json.configs.recommended],
        rules: {},
    }
);
