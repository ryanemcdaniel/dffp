import type {DispatchedClan, DispatchedHit, DispatchedPlayer, DispatchedWar} from '#src/data/ingest/ingest-types.ts';
import type {DerivedHit, DerivedWar} from '#src/data/derive/derive-types.ts';
import {pipe} from 'fp-ts/function';
import {map, reduce, sort} from 'fp-ts/Array';
import {fromCompare} from 'fp-ts/Ord';
import {Ord} from 'fp-ts/number';
import type {IDKV} from '#src/data/types.ts';
import type {n_bool} from '#src/data/types-pure.ts';

const orderHits = fromCompare<DispatchedHit>((h1, h2) => Ord.compare(h1.order, h2.order));

export const deriveWar = (war: DispatchedWar): DerivedWar => {
    const clans = pipe(war.clans, reduce({} as IDKV<DispatchedClan>, (acc, c) => {
        acc[c.cid] = c;
        return acc;
    }));

    const players = pipe(war.players, reduce({} as IDKV<DispatchedPlayer>, (acc, p) => {
        acc[p.pid] = p;
        return acc;
    }));

    return {
        ...war,
        clans: pipe(war.clans, map((c) => ({
            ...c,
            _id_war: war._id,
        }))),
        players: pipe(war.players, map((p) => ({
            ...p,
            _id_war : war._id,
            _id_clan: clans[p.cid]._id,
        }))),
        hits: pipe(
            war.hits,
            sort(orderHits),
            reduce({ore: {}, hits: []} as {ore: IDKV<n_bool>; hits: DerivedHit[]}, (acc, h) => {
                let ore0 = 0,
                    ore1 = 0;

                if (acc.ore[h.d_pid] === 1) {
                    ore1 = 1;
                }

                if (h.stars === 3 && ore1 === 0) {
                    acc.ore[h.d_pid] = 1;
                    ore0 = 1;
                }

                const attacker = players[h.a_pid];
                const defender = players[h.d_pid];
                const th_lvl_diff = defender.th_lvl - attacker.th_lvl;

                acc.hits.push({
                    ...h,

                    _id_war          : war._id,
                    _id_attacker     : players[h.a_pid]._id,
                    _id_attacker_clan: clans[players[h.a_pid].cid]._id,
                    _id_defender     : players[h.d_pid]._id,
                    _id_defender_clan: clans[players[h.d_pid].cid]._id,

                    order_norm: h.order / (2 * war.rules_size),
                    ore0,
                    ore1,
                    ccre      : (!acc.ore[h.d_pid] && th_lvl_diff >= 2)
                        ? 1
                        : 0,
                });

                return acc;
            }),
        ).hits,
    };
};
