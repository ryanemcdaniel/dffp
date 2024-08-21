import type {APIGatewayProxyEventBase, APIGatewayProxyResult} from 'aws-lambda';
import {ssm, tryJson} from '../utils';
import {GetParameterCommand} from '@aws-sdk/client-ssm';
import {unauthorized} from '@hapi/boom';
import {verifyKey} from 'discord-interactions';

// const isVerified = nacl.sign.detached.verify(
//     Buffer.from(`${req.headers['X-Signature-Timestamp']}${req.body}`),
//     Buffer.from(`${req.headers['X-Signature-Ed25519']}`, 'hex'),
//     Buffer.from(`${discord_public_key.Parameter?.Value}`, 'hex'),
// );

export const handler = async (req: APIGatewayProxyEventBase<null>): Promise<APIGatewayProxyResult> => {
    const discord_public_key = await ssm.send(new GetParameterCommand({
        Name          : 'DISCORD_PUBLIC_KEY',
        WithDecryption: true,
    }));

    const isVerified = await verifyKey(
        Buffer.from(`${req.body}`),
        `${req.headers?.['x-signature-ed25519']}`,
        `${req.headers?.['x-signature-timestamp']}`,
        `${discord_public_key.Parameter?.Value}`,
    );

    if (!isVerified) {
        const boom = unauthorized('invalid request signature');
        return {
            statusCode: boom.output.payload.statusCode,
            // headers   : boom.output.headers,
            body      : JSON.stringify({
                error  : boom.output.payload.error,
                message: boom.output.payload.message,
            }),
        };
    }

    const body = tryJson(req.body);

    if (body.type === 1) {
        return {
            statusCode: 200,
            body      : JSON.stringify({
                type: 1,
            }),
        };
    }

    return {
        statusCode: 200,
        body      : JSON.stringify({}),
    };
};
