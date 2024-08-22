// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import {inspect} from 'node:util';

const style = stylistic.configs.customize({
    flat        : true,
    indent      : 4,
    semi        : true,
    commaDangle : 'always-multiline',
    quotes      : 'single',
    arrowParens : true,
    quoteProps  : 'as-needed',
    blockSpacing: false,
    braceStyle  : 'stroustrup',
});

const config = [
    ...tseslint.config(
        {
            files  : ['**/*.ts', '**/*.mjs', '**/*.js'],
            extends: [
                eslint.configs.recommended,
                tseslint.configs.eslintRecommended,
                ...tseslint.configs.strictTypeChecked,
            ],
            languageOptions: {
                parser       : tseslint.parser,
                parserOptions: {
                    project: './tsconfig.eslint.json',
                },
            },
            plugins: {
                '@stylistic': stylistic,
            },
            linterOptions: {
                reportUnusedDisableDirectives: true,
            },
            rules: {
                '@typescript-eslint/consistent-type-imports'      : [2],
                '@typescript-eslint/consistent-type-exports'      : [2],
                '@typescript-eslint/no-non-null-assertion'        : [1],
                '@typescript-eslint/restrict-template-expressions': [2, {
                    allowBoolean: true,
                    allowNullish: true,
                    allowNumber : true,
                }],
            },
        },
        {
            ...style,
            rules: {
                ...style.rules,
                '@stylistic/key-spacing': ['error', {
                    singleLine: {beforeColon: false, afterColon: true},
                    multiLine : {beforeColon: false, afterColon: true, align: 'colon', mode: 'strict'},
                }],
                '@stylistic/object-curly-spacing'   : [2, 'never'],
                '@stylistic/type-annotation-spacing': [0],
                '@stylistic/multiline-ternary'      : [2],
                '@stylistic/max-statements-per-line': [2, {max: 2}],
                '@stylistic/semi'                   : [2, 'always', {omitLastInOneLineBlock: true}],
                '@stylistic/no-multi-spaces'        : [2, {exceptions: {TSPropertySignature: true}}],
            },
        },
    ),
];

export default config;

// console.log(inspect(config, false, null, true));
