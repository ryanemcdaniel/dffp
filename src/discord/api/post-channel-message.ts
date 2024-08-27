import {callDiscord} from '#src/discord/api/base.ts';
import {InteractionResponseType} from 'discord-interactions';
import {dLines} from '#src/discord/messages/string-ops.ts';
import {badImplementation} from '@hapi/boom';
import console from 'node:console';

export const postChannelMessage = async (discord, channelId, messages) => await callDiscord({
    method  : 'POST',
    path    : `/channels/${channelId}/messages`,
    bearer  : discord.auth_token,
    jsonBody: {
        type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: dLines(messages),
    },
});

export const logErr = async (discord, error) => {
    console.error(error);

    const boom = 'isBoom' in error
        ? error
        : badImplementation(error);

    await postChannelMessage(discord, '1277684853331988542', [
        `status:  ${boom.output.payload.statusCode}`,
        `error:   ${boom.output.payload.error}`,
        `message: ${boom.output.payload.message}`,
        `stack:   ${boom.stack}`,
    ]);

    return boom;
};
