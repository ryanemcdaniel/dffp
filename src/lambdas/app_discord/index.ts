import {getSecret} from '#src/lambdas/client-aws.ts';
import {tryJson} from '#src/lambdas/util.ts';
import type {AppDiscordEvent} from '#src/lambdas/types-events.ts';
import {authDiscord, callDiscord, initDiscord} from '#src/api/discord.ts';
import {InteractionResponseType} from 'discord-interactions';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import console from 'node:console';
import type {APIApplicationCommandInteraction, APIEmbed} from 'discord-api-types/v10';
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

        const message: string[] = await commands[body.data.name](body);

        if ('title' in message) {
            await callDiscord({
                method  : 'PATCH',
                path    : `/webhooks/${discord.app_id}/${body.token}/messages/@original`,
                bearer  : auth.access_token,
                jsonBody: {
                    type  : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    embeds: [{
                        title      : message.title,
                        description: message.desc.join(''),
                    } satisfies APIEmbed],
                },
            });
        }
        else {
            await sendNormalMessages(message, discord, auth, body);
        }
    }
    catch (e) {
        console.error(e);

        await callDiscord({
            method  : 'PATCH',
            path    : `/webhooks/${discord.app_id}/${body.token}/messages/@original`,
            bearer  : auth.access_token,
            jsonBody: {
                type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                content: `${e.message}\n${e.stack}`,
            },
        });
    }
};

const sendNormalMessages = async (message: string[], discord, auth, body) => {
    let curIdx = 0;
    let pastIdx = 0;
    let curLen = 0;
    const idxs = [];
    for (const m of message) {
        curLen += m.length;
        curIdx += 1;
        if (curLen > 1900) {
            idxs.push([pastIdx, curIdx]);
            pastIdx = curIdx;
            curLen = 0;
        }
    }

    if (curLen > 0) {
        idxs.push([pastIdx, message.length]);
    }

    // idxs[idxs.length - 1][1] = ;

    const [first, ...rest] = idxs;

    console.log('idxs', idxs);

    await callDiscord({
        method  : 'PATCH',
        path    : `/webhooks/${discord.app_id}/${body.token}/messages/@original`,
        bearer  : auth.access_token,
        jsonBody: {
            type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            content: message.slice(first[0], first[1]).join(''),
        },
    });

    for (const range of rest) {
        await callDiscord({
            method  : 'POST',
            path    : `/webhooks/${discord.app_id}/${body.token}`,
            bearer  : auth.access_token,
            jsonBody: {
                content: message.slice(range[0], range[1]).join(''),
            },
        });
    }
};
