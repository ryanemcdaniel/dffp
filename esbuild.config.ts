import {BuildOptions} from 'esbuild';
import {readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

export default {

    outdir        : 'dist',
    allowOverwrite: true,
    entryPoints   : (await readdir('src', {withFileTypes: true, recursive: true}))
        .filter((l) => l.name === 'index.ts')
        .map((l) => resolve(l.path, l.name)),

    platform      : 'node',
    target        : 'node20',
    format        : 'esm',
    bundle        : true,
    sourcemap     : 'linked',
    sourcesContent: false,

    logLevel: 'info',

} satisfies BuildOptions;
