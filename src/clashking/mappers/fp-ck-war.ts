import type {CK_War} from '#src/clashking/types.ts';
import {pipe} from 'fp-ts/function';
import {reduce, sort, zip, map, flatten} from 'fp-ts/Array';
import {hitOrd, mem, type PM, tagAndSort, type TaggedMem} from '#src/clashking/mappers/fp-ck.ts';

export type HitData = {
    res: [number, number, number, number];
    att: [string, string, string, number, number];
    def: [string, string, string, number, number];
    chr: [boolean, boolean, boolean, number, number];
};
type HitLookup = [PM<boolean>, PM<HitData[]>, PM<HitData[]>, HitData[]];

export const fpCkWar = (us_tag: string) => (war: CK_War) => {
    const [us, vs] = us_tag === war.clan.tag
        ? [war.clan, war.opponent]
        : [war.opponent, war.clan];

    const mems = zip(tagAndSort(us.tag)(us.members), tagAndSort(vs.tag)(vs.members));

    const tags = pipe(mems, reduce(mem(), (ms, [m1, m2]) => {
        ms[m1.tag] = m1;
        ms[m2.tag] = m2;
        return ms;
    }));

    const hits = pipe(
        mems,
        map(([us, vs]) => [...us.attacks ?? [], ...vs.attacks ?? []]),
        flatten,
        sort(hitOrd),
    );

    const [ore, as, ds, hs] = pipe(hits, reduce([{}, {}, {}, []] as HitLookup, ([ore, as, ds, hs], h) => {
        const attacker = tags[h.attackerTag];
        const defender = tags[h.defenderTag];

        const h_ore = ore[h.defenderTag] ?? 0;
        let h_ore_after = 0;

        if (h.stars === 3 && !ore[h.defenderTag]) {
            ore[h.defenderTag] = 1;
            h_ore_after = 1;
        }

        const h_diff_th = defender.townhallLevel - attacker.townhallLevel;
        const h_diff_pos = defender.mapPosition - attacker.mapPosition;
        const h_cc_reveal = !h_ore && h_diff_th >= 2 && h_diff_pos >= 10;

        const record = {
            res: [h.order, h.stars, h.destructionPercentage, h.duration],
            att: [h.attackerTag, attacker.c_tag, attacker.name, attacker.mapPosition, attacker.townhallLevel],
            def: [h.defenderTag, defender.c_tag, defender.name, defender.mapPosition, defender.townhallLevel],
            chr: [h_ore, h_ore_after, h_cc_reveal, h_diff_th, h_diff_pos],
        } as const satisfies HitData;

        as[h.attackerTag] ??= [];
        as[h.attackerTag].push(record);
        ds[h.defenderTag] ??= [];
        ds[h.defenderTag].push(record);
        hs.push(record);

        return [ore, as, ds, hs];
    }));

    return {
        w_n_team  : war.teamSize,
        w_n_hits  : war.attacksPerMember,
        w_t_prep  : war.preparationStartTime,
        w_t_start : war.startTime,
        w_t_end   : war.endTime,
        us        : us,
        vs        : vs,
        mems      : mems,
        tags      : tags,
        hit_lookup: {
            def_ore: ore,
            att    : as,
            def    : ds,
            ord    : hs,
        },
    };
};
