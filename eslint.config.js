// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
    ...tseslint.config(
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
    ),
    stylistic.configs.customize({
        indent     : 4,
        quotes     : 'single',
        semi       : true,
        commaDangle: 'always-multiline',
        arrowParens: true,
        quoteProps : 'as-needed',
    }),
    {
        rules: {
            '@stylistic/key-spacing': [2, {
                align: 'colon',
            }],
        },
    },
];
