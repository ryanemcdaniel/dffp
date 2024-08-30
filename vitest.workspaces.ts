import {defineWorkspace} from 'vitest/config';

export default defineWorkspace([{
    extends: './vitest.config.ts',
    test   : {
        name   : 'unit',
        include: ['test/unit'],
    },
}, {
    extends: './vitest.config.ts',
    test   : {
        name   : 'fullstack',
        include: ['test/fullstack'],
    },
}]);
