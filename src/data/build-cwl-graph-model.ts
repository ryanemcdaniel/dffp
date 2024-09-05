import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {notFound} from '@hapi/boom';
import {pipe} from 'fp-ts/function';
import {callCkWarsByClan} from '#src/data/api/api-ck-previous-wars.ts';
import {callCkWarsByPlayer} from '#src/data/api/api-ck-previous-hits.ts';
import {ingestCkToModel} from '#src/data/pipeline/ingest-ck.ts';
import {deriveModel} from '#src/data/pipeline/derive.ts';
import {accumulateWarData, optimizeGraphModel} from '#src/data/pipeline/optimize-graph-model.ts';
import {filterL, flatMapL, mapL} from '#src/data/pure-list.ts';
import {fetchCurrentClanWar} from '#src/discord/command-util/fetch-current.ts';
import console from 'node:console';
import {CK_LIMIT} from '#src/data/api/api-ck.ts';

export const buildCwlGraphModel = async (cid: string, withCurrent: boolean = false, otherWars: boolean = false, limit = CK_LIMIT) => {
    const cwl = await api_coc.getClanWarLeagueGroup(cid);

    if (cwl.isNotInWar) {
        throw notFound('no current CWL data available');
    }

    if (cwl.state === 'ended') {
        throw notFound('current CWL has already ended');
    }

    const clanTags = pipe(cwl.clans, mapL((c) => c.tag));

    const playerTags = pipe(cwl.clans, flatMapL((c) => c.members), mapL(((m) => m.tag)));

    const players = withCurrent
        ? await api_coc.getPlayers(playerTags)
        : [];

    const previousWarsByClan = await callCkWarsByClan(clanTags, limit);

    const previousWarsByPlayer = otherWars
        ? await callCkWarsByPlayer(playerTags, limit)
        : [];

    const model = pipe(
        ingestCkToModel(previousWarsByClan, players, previousWarsByPlayer),
        deriveModel,
        accumulateWarData,
        optimizeGraphModel,
    );

    const cwlWars = pipe(
        await cwl.getWars(),
    );

    return {
        model        : model,
        opponentClans: pipe(
            cwlWars,
            filterL((w) => w.isPreparationDay),
            flatMapL((w) => [w.clan, w.opponent]),
        ),
        players   : players,
        currentWar: pipe(cwlWars, filterL((w) => [w.clan.tag, w.opponent.tag].includes(cid))),
    };
};
