import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        watch             : false,
        globals           : true,
        expandSnapshotDiff: true,
        chaiConfig        : {
            includeStack     : true,
            truncateThreshold: false,
        },
        coverage: {
            provider       : 'istanbul',
            reporter       : ['lcov'],
            all            : true,
            skipFull       : true,
            reportOnFailure: true,
            thresholds     : {
                100    : true,
                perFile: true,
            },
        },
        logHeapUsage: true,
    },
});
