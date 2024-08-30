import {defineConfig} from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test   : {
        name          : 'init',
        logHeapUsage  : true,
        snapshotFormat: {
            callToJSON: false,

            compareKeys : null,
            min         : false,
            escapeString: true,
            escapeRegex : false,
            indent      : 2,
            maxWidth    : 100,
        },
    },
});
