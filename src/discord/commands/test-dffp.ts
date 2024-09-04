import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';

export const testDffp = buildCommand(COMMANDS.TEST_DFFP, async (body) => {
    return [{
        desc: ['WIP'],
    }];
});
