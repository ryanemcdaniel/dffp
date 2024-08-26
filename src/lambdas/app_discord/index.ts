import {getSecret} from '#src/lambdas/client-aws.ts';
import {tryJson} from '#src/lambdas/util.ts';
import {InteractionResponseType} from 'discord-interactions';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import console from 'node:console';
import type {APIChatInputApplicationCommandInteraction} from 'discord-api-types/v10';
import {show} from '../../../util.ts';
import {authDiscord, callDiscord, initDiscord} from '#src/discord/api/base.ts';
import {COMMANDS} from '#src/discord/commands.ts';
import type {SQSRecord} from 'aws-lambda';

/**
 * @init
 */
const HANDLE_COMMANDS = COMMANDS.reduce(
    (acc, cmd) => {
        acc[cmd.deploy.name] = cmd.handle;
        return acc;
    },
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as {[N in typeof COMMANDS[number]['deploy']['name']]: Extract<typeof COMMANDS[number], {deploy: {name: N}}>['handle']},
);

type AppDiscordEvent = {
    Records: (Omit<SQSRecord, 'body'> & {body: APIChatInputApplicationCommandInteraction & {data: {name: typeof COMMANDS[number]['deploy']['name']}}})[];
};

const init = (async () => {
    const email = await getSecret('COC_USER');
    const password = await getSecret('COC_PASSWORD');

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

        auth = await authDiscord(discord.client_id, discord.client_secret, 'identify connections');

        await HANDLE_COMMANDS[body.data.name](
            {
                ...discord,
                auth_token: auth.contents.access_token,
            },
            body.data,
            body.data.options?.reduce((acc, op) => {
                acc[op.name] = op;
                return acc;
            }, {}) ?? {},
        );
    }
    catch (e) {
        console.error(e);

        if ('isBoom' in e) {
            await callDiscord({
                method  : 'PATCH',
                path    : `/webhooks/${discord.app_id}/${body.token}/messages/@original`,
                bearer  : auth.contents.access_token,
                jsonBody: {
                    type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    content: `error: ${e.output.payload.error}\nmessage: ${e.output.payload.message}`,
                },
            });
        }
        else {
            await callDiscord({
                method  : 'PATCH',
                path    : `/webhooks/${discord.app_id}/${body.token}/messages/@original`,
                bearer  : auth.contents.access_token,
                jsonBody: {
                    type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    content: e.message,
                },
            });
        }
    }
};
