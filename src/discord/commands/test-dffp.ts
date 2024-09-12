import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';
import {getAliasTag} from '#src/discord/command-util/get-alias-tag.ts';
import console from 'node:console';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import Bourne from '@hapi/bourne';
import {bindApiCall} from '#src/api/api-call.ts';

export const testDffp = buildCommand(COMMANDS.TEST_DFFP, async (body) => {
    const clanTag = getAliasTag();

    const call = bindApiCall('https://discord.com/api');

    await call({
        path    : '/webhooks/1280364563379916821/YDmXAIIyHYMVTu97FmWu7zqBHnydo8cT4gsqEnFqRjC3yqfPqQeBOISSPd-veC1f2kIK',
        method  : 'POST',
        jsonBody: {
            content: 'test debug message',
        },
    });

    return [{
        desc: [
            'ope',
        ],
    }];
});
