import {getSecret} from '#src/lambdas/client-aws.ts';
import {tryJson} from '#src/lambdas/util.ts';
import {InteractionResponseType} from 'discord-interactions';
import {api_coc, init_api_coc} from '#src/lambdas/client-api-coc.ts';
import type {APIChatInputApplicationCommandInteraction} from 'discord-api-types/v10';
import {show} from '../../../util.ts';
import {authDiscord, callDiscord, initDiscord} from '#src/discord/api/base.ts';
import type {SQSRecord} from 'aws-lambda';
import {WAR_LINKS} from '#src/discord/commands/war-links.ts';
import {WAR_OPPONENT} from '#src/discord/commands/war-opponent.ts';
import {logErr} from '#src/discord/api/post-channel-message.ts';

/**
 * @init
 */
const HANDLE_COMMANDS = {
    [WAR_LINKS.deploy.name]   : WAR_LINKS.handle,
    [WAR_OPPONENT.deploy.name]: WAR_OPPONENT.handle,
} as const;

type AppDiscordEvent = {
    Records: (Omit<SQSRecord, 'body'> & {body: APIChatInputApplicationCommandInteraction})[];
};

const init = (async () => {
    const email = await getSecret('COC_USER');
    const password = await getSecret('COC_PASSWORD');

    await init_api_coc();
    await api_coc.login({
        email,
        password,
        keyCount: 1,
        keyName : `${process.env.LAMBDA_ENV}-app-discord`,
    });

    return await initDiscord();
})();

/**
 * @invoke
 */
export const handler = async (event: AppDiscordEvent) => {
    const discord = await init;

    let auth: Awaited<ReturnType<typeof authDiscord>>,
        body: typeof event.Records[0]['body'];

    try {
        body = tryJson(event.Records[0].body);

        show(body);

        auth = await authDiscord(discord, 'identify connections');

        await HANDLE_COMMANDS[body.data.name](
            {
                ...discord,
                auth_token: auth.contents.access_token,
            },
            body,
            body.data.options?.reduce((acc, op) => {
                acc[op.name] = op;
                return acc;
            }, {}) ?? {},
        );
    }
    catch (e) {
        await logErr(discord, e);

        await callDiscord({
            method  : 'PATCH',
            path    : `/webhooks/${discord.app_id}/${body.token}/messages/@original`,
            bearer  : auth.contents.access_token,
            jsonBody: {
                type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                content: 'failure, check server logs',
            },
        });
    }
};
