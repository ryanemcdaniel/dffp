import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {BATCH_SIZE} from '#src/lambdas/poll_coc/contants.ts';
import {aws_ddb} from '#src/lambdas/client-aws-ddb.ts';

export const pollClans = async (tags: string[]) => {
    const clans = await api_coc.getClans(tags);

    const batched = Array(Math.ceil(clans.length / BATCH_SIZE))
        .fill(0)
        .map((_, idx) => clans.slice(idx * BATCH_SIZE, idx * BATCH_SIZE + BATCH_SIZE));

    for (const clan of batched) {
        await aws_ddb.batchWrite({
            RequestItems: {
                [process.env.DDB_SNAPSHOTS]: clan.map((c) => ({
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
    // await Promise.all(clans.map(async (clan) => {
    //
    // }));
};
