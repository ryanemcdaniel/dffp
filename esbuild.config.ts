import {BuildOptions} from 'esbuild';
import {readdir} from 'node:fs/promises';

const lambdas = await readdir('src/lambdas', {withFileTypes: true});

console.log(process.cwd());

export default {
    entryPoints: lambdas
        .filter((l) => l.isDirectory())
        .map((l) => `src/lambdas/${l.name}/index.ts`),
    outdir: 'dist',

    bundle        : true,
    sourcesContent: false,
    platform      : 'node',
    target        : 'node20',
} satisfies BuildOptions;
