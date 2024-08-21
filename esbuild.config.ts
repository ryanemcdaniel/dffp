import type {BuildOptions} from 'esbuild';
import {readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

export default {
    entryPoints:
        (await readdir('src', {withFileTypes: true, recursive: true}))
            .filter((l) => l.name === 'index.ts')
            .map((l) => resolve(l.path, l.name)),

    platform: 'node',
    target  : 'node20',

    format      : 'esm',
    outExtension: {'.js': '.mjs'},
    mainFields  : ['module', 'main'],
    external    : [
        '@aws-sdk/*',
        'node:*',
    ],

    bundle           : true,
    treeShaking      : true,
    minifySyntax     : true,
    minifyWhitespace : true,
    minifyIdentifiers: false,

    sourcemap     : 'linked',
    sourcesContent: false,
    outdir        : 'dist',

    logLevel      : 'info',
    allowOverwrite: true,

} satisfies BuildOptions;
