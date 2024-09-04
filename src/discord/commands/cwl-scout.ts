import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';

export const cwlScout = buildCommand(COMMANDS.CWL_SCOUT, async (body) => {
    return [{
        desc: ['WIP'],
    }];
});
