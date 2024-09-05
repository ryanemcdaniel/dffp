import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';
import {getAliasTag} from '#src/discord/command-util/get-alias-tag.ts';
import console from 'node:console';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import Bourne from '@hapi/bourne';

export const testDffp = buildCommand(COMMANDS.TEST_DFFP, async (body) => {
    const clanTag = getAliasTag();

    return [{
        desc: [
            'ope',
        ],
    }];
});
