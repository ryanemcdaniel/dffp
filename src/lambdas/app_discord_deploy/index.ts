import {authDiscord, callDiscord, initDiscord} from '#src/discord/api/base.ts';
import {WAR_LINKS_SPEC} from '#src/discord/commands/war-links.ts';
import {WAR_OPPONENT_SPEC} from '#src/discord/commands/war-opponent.ts';
import {logErr} from '#src/discord/api/post-channel-message.ts';

/**
 * @init
 */
const DEPLOY_COMMANDS = [
    WAR_LINKS_SPEC,
    WAR_OPPONENT_SPEC,
];

const discord = await initDiscord();

/**
 * @invoke
 */
export const handler = async () => {
    try {
        const bearer = await authDiscord(discord, 'applications.commands.update');

        for (const cmd of DEPLOY_COMMANDS) {
            await callDiscord({
                method  : 'POST',
                path    : `/applications/${discord.app_id}/commands`,
                bearer  : bearer.contents.access_token,
                jsonBody: cmd,
            });
        }
    }
    catch (e) {
        await logErr(discord, e);
    }
};
