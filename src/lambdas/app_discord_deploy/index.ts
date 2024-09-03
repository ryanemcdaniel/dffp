import {getSecret} from '#src/lambdas/client-aws.ts';
import {authDiscord, callDiscord} from '#src/api/discord.ts';
import type {APIApplicationCommand, RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v10';
import {ApplicationCommandType, ApplicationCommandOptionType} from 'discord-api-types/v10';

/**
 * @init
 */
const discord_public_key = await getSecret('DISCORD_PUBLIC_KEY');
const discord_app_id = await getSecret('DISCORD_APP_ID');
const discord_client_id = await getSecret('DISCORD_CLIENT_ID');
const discord_client_secret = await getSecret('DISCORD_CLIENT_SECRET');

const commands = [
    {
        type       : ApplicationCommandType.ChatInput,
        name       : 'war-opponent',
        description: 'TBD',
        options    : [{
            type       : ApplicationCommandOptionType.String,
            name       : 'clan',
            description: 'tag or alias (ex. #2GR2G0PGG, main, labs, ctd, ...)',
            required   : true,
        }],
    },
    {
        type       : ApplicationCommandType.ChatInput,
        name       : 'war-links',
        description: 'get player profile links of enemy top #10 for scouting',
        options    : [{
            type       : ApplicationCommandOptionType.String,
            name       : 'clan',
            description: 'tag or alias (ex. #2GR2G0PGG, main, labs, ctd, ...)',
            required   : true,
        }],
    },
] as const satisfies RESTPostAPIApplicationCommandsJSONBody[];

/**
 * @invoke
 */
export const handler = async () => {
    const bearer = await authDiscord(
        discord_client_id,
        discord_client_secret,
        'applications.commands.update',
    );

    for (const cmd of commands) {
        await callDiscord({
            method  : 'POST',
            path    : `/applications/${discord_app_id}/commands`,
            bearer  : bearer.access_token,
            jsonBody: cmd,
        });
    }
};
