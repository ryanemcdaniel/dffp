import {aws_ddb} from '#src/lambdas/client-aws-ddb.ts';
import {DFFP_CLANS, DFFP_PLAYERS, SERVER_ID} from '#src/lambdas/temp-constants.ts';
import * as console from 'node:console';

/**
 * @init
 */

/**
 * @invoke
 */
export const handler = async () => {
    await aws_ddb.put({
        TableName: process.env.DDB_TRACKING,
        Item     : {
            type   : SERVER_ID,
            clans  : DFFP_CLANS,
            players: DFFP_PLAYERS,
        },
    });

    // todo register slash commands

    console.info('deploy successful');
};
