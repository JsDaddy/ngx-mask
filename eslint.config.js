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
    '.cache',
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
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.eslint.json'],
            },
        },
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
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/ban-ts-comment': ['error', { minimumDescriptionLength: 10 }],
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/no-duplicate-enum-values': 'error',
            '@typescript-eslint/no-empty-object-type': 'error',
            '@typescript-eslint/no-extra-non-null-assertion': 'error',
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-this-alias': 'error',
            '@typescript-eslint/no-unnecessary-type-constraint': 'error',
            '@typescript-eslint/no-unsafe-declaration-merging': 'error',
            '@typescript-eslint/no-useless-constructor': 'error',
            '@typescript-eslint/no-wrapper-object-types': 'error',
            '@typescript-eslint/prefer-as-const': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/triple-slash-reference': 'error',
            'no-array-constructor': 'off',
            'no-useless-constructor': 'off',
            'no-return-await': 'error',
            'no-useless-catch': 'error',
            'no-unused-labels': 'error',
            'no-unneeded-ternary': 'error',
            'no-undef-init': 'error',
            'no-regex-spaces': 'error',
            'no-proto': 'error',
            'no-new-wrappers': 'error',
            'no-unused-private-class-members': 'error',
            'no-invalid-regexp': 'error',
            curly: ['error', 'all'],
            '@typescript-eslint/restrict-template-expressions': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            'no-console': ['warn'],
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
            'no-unused-vars': 'off',
            'no-duplicate-imports': 'off',
            '@typescript-eslint/no-invalid-void-type': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/indent': 0,
            '@typescript-eslint/member-delimiter-style': 0,
            '@typescript-eslint/no-var-requires': 0,
            '@typescript-eslint/no-use-before-define': 0,
            'prefer-const': 1,
            'prefer-spread': 1,
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    custom: {
                        regex: '^I[A-Z]',
                        match: true,
                    },
                },
            ],
            'import/no-unresolved': 'off',
            'import/no-extraneous-dependencies': 'off',
            'import/prefer-default-export': 'off',
            'no-underscore-dangle': 'off',
            'class-methods-use-this': 'off',
            'lines-between-class-members': 'off',
            'no-return-assign': 'off',
            'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],

            //THINK ABOUT THIS
            // 'no-param-reassign': 'off',
            'no-param-reassign': 'error',
            'no-undefined': 'error',

            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                {
                    assertionStyle: 'as',
                },
            ],
            'no-plusplus': ['off'],
            '@typescript-eslint/unbound-method': 'off',
            'import/no-cycle': 'off',
            'import/extensions': 'off',
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
