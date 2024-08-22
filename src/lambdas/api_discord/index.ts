import type {APIGatewayProxyEventBase, APIGatewayProxyResult} from 'aws-lambda';
import {badImplementation} from '@hapi/boom';
import type {Boom} from '@hapi/boom';
import {unauthorized} from '@hapi/boom';
import {verifyKey} from 'discord-interactions';
import {getSecret} from '#src/lambdas/client-aws.ts';
import {DISCORD_PING, DISCORD_PONG, respond, tryJson} from '#src/lambdas/api_discord/api-util.ts';

/**
 * @init
 */
const discord_public_key = await getSecret('DISCORD_PUBLIC_KEY');

/**
 * @invoke
 */
export const handler = async (req: APIGatewayProxyEventBase<null>): Promise<APIGatewayProxyResult> => {
    try {
        const signature = req.headers['x-signature-ed25519']!;
        const timestamp = req.headers['x-signature-timestamp']!;

        const isVerified = await verifyKey(Buffer.from(req.body!), signature, timestamp, discord_public_key);

        if (!isVerified) {
            throw unauthorized('invalid request signature');
        }

        const body = tryJson(req.body);

        if (body.type === DISCORD_PING.type) {
            return respond(200, DISCORD_PONG);
        }

        return respond(200, {});
    }
    catch (e) {
        const error = e as Error | Boom;

        console.error(error, req);

        const boom = 'isBoom' in error
            ? error
            : badImplementation();

        return respond(boom.output.statusCode, boom.output.payload);
    }
};
