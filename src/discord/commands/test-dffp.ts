import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';
import {getAliasTag} from '#src/discord/command-util/get-alias-tag.ts';

export const testDffp = buildCommand(COMMANDS.TEST_DFFP, async (body) => {
    const clanTag = getAliasTag();

    return [{
        desc: [
            'ope',
        ],
    }];
});
