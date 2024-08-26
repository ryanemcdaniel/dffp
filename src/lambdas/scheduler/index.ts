import {aws_sqs} from '#src/lambdas/client-aws.ts';
import {getServerTrackingRecord} from '#src/lambdas/client-aws-ddb.ts';
import {SERVER_ID} from '#src/lambdas/temp-constants.ts';
import * as process from 'node:process';

/**
 * @init
 */

/**
 * @invoke
 */
export const handler = async () => {
    const server = await getServerTrackingRecord(SERVER_ID);

    await aws_sqs.sendMessage({
        QueueUrl   : process.env.SQS_POLL,
        MessageBody: JSON.stringify({
            clans  : server.clans,
            players: server.players,
        }),
    });
};
