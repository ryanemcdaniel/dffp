import type {CK_War} from '#src/clashking/types.ts';
import {flow, pipe} from 'fp-ts/function';
import {concat, flatMap, flatten, map, of, reduce, sort, zip} from 'fp-ts/Array';
import {memCK, memOrd} from '#src/data/fp-builders/fp-member.ts';
import {reduceKV} from '#src/pure/pure.ts';
import {fpCkHits} from '#src/clashking/mappers/fp-ck-hits.ts';
import {type Hit, partitionHitsDefenses} from '#src/data/fp-builders/fp-hit.ts';
import {hitOrd} from '#src/data/cp-ck.ts';

export type War = {
    rules_prep : string;
    rules_start: string;
    rules_end  : string;
    rules_team : string;
    rules_natks: string;

    cid : string;
    name: string;
    clvl: number;

    score_attacks   : number;
    score_stars     : number;
    score_percentage: number;
    score_duration  : number;

    other_cid : string;
    other_name: string;
    other_clvl: number;

    other_score_attacks   : number;
    other_score_stars     : number;
    other_score_percentage: number;
    other_score_duration  : number;

    mirror_diff: [number, number, number, number];
    hits       : Hit[];
    defs       : Hit[];
};

export const toWar = flow((us_tag: string) => (war: CK_War) => {
    const [us, vs] = us_tag === war.clan.tag
        ? [war.clan, war.opponent]
        : [war.opponent, war.clan];

    const us_ms = pipe(us.members, map(memCK(us.tag)), sort(memOrd));
    const vs_ms = pipe(vs.members, map(memCK(vs.tag)), sort(memOrd));
    const ms_mirrors = zip(us_ms, vs_ms);

    const ms_kpid = pipe(ms_mirrors, flatten, reduceKV('pid'));

    const hits_ck = pipe(
        us.members,
        concat(vs.members),
        flatMap((ms) => [...ms.attacks ?? []]),
        sort(hitOrd),
    );

    const hits = pipe(hits_ck, fpCkHits(ms_kpid), partitionHitsDefenses(us.tag));

    const us_duration = pipe(hits.right, reduce(0, (hs, h) => hs + h.h_dur), of, map((hs) => hs / hits.right.length));
    const vs_duration = pipe(hits.left, reduce(0, (hs, h) => hs + h.h_dur), of, map((hs) => hs / hits.left.length));

    return {
        rules_prep : war.preparationStartTime,
        rules_start: war.startTime,
        rules_end  : war.endTime,
        rules_team : war.teamSize,
        rules_natks: war.attacksPerMember,

        cid : us.tag,
        name: us.name,
        clvl: us.clanLevel,

        score_attacks   : us.attacks,
        score_stars     : us.stars,
        score_percentage: us.destructionPercentage,
        score_duration  : us_duration,

        other_cid : vs.tag,
        other_name: vs.name,
        other_clvl: vs.clanLevel,

        other_score_attacks   : vs.attacks,
        other_score_stars     : vs.stars,
        other_score_percentage: vs.destructionPercentage,
        other_score_duration  : vs_duration,

        mirror_diff: pipe(ms_mirrors, map(([u, v]) => [u.pos, u.thl, v.thl, u.thl - v.thl])),
        hits       : hits.right,
        // hits_by_ms : pipe(hits.right, reduceKVs('a_pid')),
        defs       : hits.left,
        // defs_by_ms : pipe(hits.right, reduceKVs('a_pid')),
    };
});
