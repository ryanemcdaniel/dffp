import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {BATCH_SIZE} from '#src/lambdas/poll_coc/contants.ts';
import {aws_ddb} from '#src/lambdas/client-aws-ddb.ts';

export const pollPlayers = async (tags: string[]) => {
    const players = await api_coc.getPlayers(tags);

    const batched = Array(Math.ceil(players.length / BATCH_SIZE))
        .fill(0)
        .map((_, idx) => players.slice(idx * BATCH_SIZE, idx * BATCH_SIZE + BATCH_SIZE));

    for (const players of batched) {
        await aws_ddb.batchWrite({
            RequestItems: {
                [process.env.DDB_SNAPSHOTS]: players.map((c) => ({
                    PutRequest: {
                        Item: {
                            id  : c.tag,
                            time: 'current',
                            name: c.name,
                        },
                    },
                })),
            },
        });
    }

    // todo check parallelism with dynamodb
    // await Promise.all(players.map(async (player) => {
    //
    // }));
};
