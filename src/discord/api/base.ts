import {bindApiCall} from '#src/api/api-call.ts';
import {URLSearchParams} from 'node:url';
import {getSecret} from '#src/lambdas/client-aws.ts';

export const callDiscord = bindApiCall('https://discord.com/api/v10');

export const authDiscord = async (discord: DiscordCtx, scope: string) => await callDiscord<{access_token: string}>({
    method : 'POST',
    path   : '/oauth2/token',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        grant_type   : 'client_credentials',
        scope        : scope,
        client_id    : discord.client_id,
        client_secret: discord.client_secret,
    }),
});

export const initDiscord = async () => {
    const discord_public_key = await getSecret('DISCORD_PUBLIC_KEY');
    const discord_app_id = await getSecret('DISCORD_APP_ID');
    const discord_client_id = await getSecret('DISCORD_CLIENT_ID');
    const discord_client_secret = await getSecret('DISCORD_CLIENT_SECRET');

    return {
        public_key   : discord_public_key,
        app_id       : discord_app_id,
        client_id    : discord_client_id,
        client_secret: discord_client_secret,
    };
};
export type DiscordCtx = Awaited<ReturnType<typeof initDiscord>>;
