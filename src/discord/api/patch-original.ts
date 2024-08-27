import {InteractionResponseType} from 'discord-interactions';
import type {DiscordCtx, Interaction, SpecInput} from '#src/discord/types.ts';

export const patchOriginal = (discord: DiscordCtx, interaction: Interaction<SpecInput>, message: unknown) => ({
    method  : 'PATCH',
    path    : `/webhooks/${discord.app_id}/${interaction.token}/messages/@original`,
    bearer  : discord.auth_token,
    jsonBody: {
        type   : InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: message,
    },
});
