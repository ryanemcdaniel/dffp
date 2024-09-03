import {getSecret} from '#src/lambdas/client-aws.ts';
import {tryJson} from '#src/lambdas/util.ts';
import type {AppDiscordEvent} from '#src/lambdas/types-events.ts';
import {authDiscord, callDiscord, initDiscord} from '#src/api/discord.ts';
import {InteractionResponseType} from 'discord-interactions';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import console from 'node:console';
import type {APIApplicationCommandInteraction} from 'discord-api-types/v10';
import {warLinks} from '#src/lambdas/app_discord/commands/war-links.ts';
import {show} from '../../../util.ts';
import {warOpponent} from '#src/lambdas/app_discord/commands/war-opponent.ts';

/**
 * @init
 */
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

const commands = {
    'war-opponent': warOpponent,
    'war-links'   : warLinks,
};

/**
 * @invoke
 */
export const handler = async (event: AppDiscordEvent) => {
    const discord = await init;

    let auth: Awaited<ReturnType<typeof authDiscord>>,
        body: APIApplicationCommandInteraction;

    try {
        body = tryJson(event.Records[0].body);

        show(body);

        auth = await authDiscord(discord.client_id, discord.client_secret, 'identify connections');

        const message = await commands[body.data.name](body);

        await callDiscord({
            method  : 'PATCH',
            path    : `/webhooks/${discord.app_id}/${body.token}/messages/@original`,
            bearer  : auth.access_token,
            jsonBody: {
                type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                content: message,
            },
        });
    }
    catch (e) {
        console.error(e);

        await callDiscord({
            method  : 'PATCH',
            path    : `/webhooks/${discord.app_id}/${body.token}/messages/@original`,
            bearer  : auth.access_token,
            jsonBody: {
                type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                content: e.message,
            },
        });
    }
};
