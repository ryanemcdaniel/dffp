import type {RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v10';
import {authDiscord, callDiscord, initDiscord} from '#src/discord/api/base.ts';
import {COMMANDS} from '#src/discord/commands.ts';

/**
 * @init
 */
const DEPLOY_COMMANDS = COMMANDS.map((cmd) => cmd.deploy) satisfies RESTPostAPIApplicationCommandsJSONBody[];

const discord = await initDiscord();

/**
 * @invoke
 */
export const handler = async () => {
    const bearer = await authDiscord(discord, 'applications.commands.update');

    for (const cmd of DEPLOY_COMMANDS) {
        await callDiscord({
            method  : 'POST',
            path    : `/applications/${discord.app_id}/commands`,
            bearer  : bearer.contents.access_token,
            jsonBody: cmd,
        });
    }
};
