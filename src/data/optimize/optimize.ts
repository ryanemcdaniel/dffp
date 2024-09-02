import type {DerivedWar} from '#src/data/derive/derive-types.ts';
import {pipe} from 'fp-ts/function';
import {reduce} from 'fp-ts/Array';
import type {OptimizedWar, OptimizedWars} from '#src/data/optimize/optimize-types.ts';

export const accumulateWarData = (wars: DerivedWar[]): OptimizedWars['data'] => {
    const data_initial = {
        wars   : [],
        clans  : [],
        players: [],
        hits   : [],
    } as OptimizedWars['data'];

    return pipe(wars, reduce(data_initial, (acc, w) => {
        acc.wars.push(w);
        acc.clans.push(...w.clans);
        acc.players.push(...w.players);
        acc.hits.push(...w.hits);
        return acc;
    }));
};

export const linkGraph = (data: OptimizedWars['data']): OptimizedWars => {
    const wars = {} as OptimizedWars['wars'];
    const clans = {} as OptimizedWars['clans'];
    const players = {} as OptimizedWars['players'];
    const hits = {} as OptimizedWars['hits'];

    for (const c of data.clans) {
        clans[c._id] = {
            data    : c,
            players : {},
            enemy   : {},
            attacks : {},
            defenses: {},
        };
    }

    for (const w of data.wars) {
        wars[w._id] = {
            data : w,
            clan1: clans[w.clans[0]._id],
            clan2: clans[w.clans[1]._id],
            clans: {},
            hits : {},
        };
        clans[w.clans[0]._id].war = wars[w._id];
        clans[w.clans[0]._id].enemy = clans[w.clans[1]._id];
        clans[w.clans[1]._id].war = wars[w._id];
        clans[w.clans[1]._id].enemy = clans[w.clans[0]._id];
        wars[w._id].clans[w.clans[0]._id] = clans[w.clans[0]._id];
        wars[w._id].clans[w.clans[1]._id] = clans[w.clans[1]._id];
    }

    for (const p of data.players) {
        players[p._id] = {
            data    : p,
            war     : wars[p._id_war],
            clan    : clans[p._id_clan],
            attacks : {},
            defenses: {},
        };
        clans[p._id_clan].players[p._id] = players[p._id];
    }

    for (const h of data.hits) {
        hits[h._id] = {
            data    : h,
            war     : wars[h._id_war],
            attacker: players[h._id_attacker],
            defender: players[h._id_defender],
        };
        wars[h._id_war].hits[h._id] = hits[h._id];
        players[h._id_attacker].attacks[h._id] = hits[h._id];
        players[h._id_defender].defenses[h._id] = hits[h._id];
        clans[h._id_attacker_clan].attacks[h._id] = hits[h._id];
        clans[h._id_defender_clan].defenses[h._id] = hits[h._id];
    }

    return {
        data,
        wars,
        clans,
        players,
        hits,
    };
};
