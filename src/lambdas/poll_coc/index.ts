import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {getSecret} from '#src/lambdas/client-aws.ts';
import type {PollCocEvent, PollRecord} from '#src/lambdas/types-events.ts';
import {tryJson} from '#src/lambdas/util.ts';
import {pollClans} from '#src/lambdas/poll_coc/polls/clans.ts';
import {pollPlayers} from '#src/lambdas/poll_coc/polls/players.ts';
import {COC_PASSWORD, COC_USER} from '#src/constants-secrets.ts';

/**
 * @init
 */
const init = (async () => {
    const email = await getSecret(COC_USER);
    const password = await getSecret(COC_PASSWORD);

    await api_coc.login({
        email,
        password,
        keyName: `${process.env.LAMBDA_ENV}-poll-coc`,
    });
})();

/**
 * @invoke
 */
export const handler = async (event: PollCocEvent) => {
    await init;

    const allTags = event.Records.reduce<PollRecord['body']>((acc, record) => {
        const json = tryJson(record.body);

        acc.clans.push(...json.clans);
        acc.players.push(...json.players);

        return acc;
    }, {clans: [], players: []});

    await pollClans(allTags.clans);
    await pollPlayers(allTags.players);
};
