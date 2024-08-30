import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        watch             : false,
        expandSnapshotDiff: true,
        chaiConfig        : {
            includeStack     : true,
            truncateThreshold: false,
        },
        testTimeout: 30000,
        coverage   : {
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
    },
});
