import type {BuildOptions} from 'esbuild';
import {readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const [poll_coc] = (await readdir('src', {withFileTypes: true, recursive: true}))
    .filter((l) => l.name === 'index.ts')
    .map((l) => resolve(l.parentPath, l.name))
    .filter((l) => l.includes('poll_coc'));

export default {

    entryPoints   : [poll_coc],
    outdir        : 'dist/poll_coc',
    logLevel      : 'info',
    allowOverwrite: true,

    platform: 'node',
    target  : 'node20',

    format: 'cjs',
    // outExtension: {'.js': '.mjs'},
    // mainFields  : ['main', 'module'],
    // conditions  : ['import'],

    bundle           : true,
    external         : ['@aws-sdk/*', 'node:*'],
    treeShaking      : true,
    minifySyntax     : true,
    minifyIdentifiers: true,
    minifyWhitespace : true,
    sourcemap        : 'linked',
    sourcesContent   : false,

} satisfies BuildOptions;
