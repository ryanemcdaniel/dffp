import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {pipe} from 'fp-ts/function';
import {concat, map, sort} from 'fp-ts/Array';
import {fromCompare} from 'fp-ts/Ord';
import type {ClanWarMember} from 'clashofclans.js';
import {Ord} from 'fp-ts/number';
import {getAliasTag} from '#src/discord/command-util/get-alias-tag.ts';
import {notFound} from '@hapi/boom';
import {ingestCkToModel} from '#src/data/pipeline/ingest-ck.ts';
import {deriveModel} from '#src/data/pipeline/derive.ts';
import {accumulateWarData, optimizeGraphModel} from '#src/data/pipeline/optimize-graph-model.ts';
import {callCkWarsByClan} from '#src/data/api/api-ck-previous-wars.ts';
import {callCkWarsByPlayer} from '#src/data/api/api-ck-previous-hits.ts';

export const buildGraphModel = async (maybeCid?: string, withCurrent: boolean = false, otherWars: boolean = false) => {
    const clanTag = getAliasTag(maybeCid);

    const war = await api_coc.getCurrentWar(clanTag);

    if (!war) {
        throw notFound('no current war data available');
    }

    if (war.isWarEnded) {
        throw notFound('current war has already ended');
    }

    const clanMembers = pipe(war.clan.members, sort(fromCompare<ClanWarMember>((a, b) => Ord.compare(a.mapPosition, b.mapPosition))));
    const opponentTag = war.opponent.tag;
    const opponentMembers = pipe(war.opponent.members, sort(fromCompare<ClanWarMember>((a, b) => Ord.compare(a.mapPosition, b.mapPosition))));

    const playerTags = pipe(clanMembers, concat(opponentMembers), map((m) => m.tag));
    const players = withCurrent
        ? await api_coc.getPlayers(playerTags)
        : [];

    const previousWarsByClan = await callCkWarsByClan([clanTag, opponentTag]);
    const previousWarsByPlayer = otherWars
        ? await callCkWarsByPlayer(playerTags)
        : [];

    return {
        model: pipe(
            ingestCkToModel(previousWarsByClan, players, previousWarsByPlayer),
            deriveModel,
            accumulateWarData,
            optimizeGraphModel,
        ),
        clanTag,
        clanMembers,
        opponentTag,
        opponentMembers,
        currentWar: war,
    };
};
