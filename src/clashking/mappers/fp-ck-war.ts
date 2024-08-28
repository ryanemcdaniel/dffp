import type {CK_War} from '#src/clashking/types.ts';
import {pipe} from 'fp-ts/function';
import {reduce, sort, zip, map, of, flatMap, concat, flatten} from 'fp-ts/Array';
import {memCK, memOrd, type MemR} from '#src/model/fp-member.ts';
import {reduceKV, reduceKVs} from '#src/model/pure.ts';
import {partitionHitsDefenses} from '#src/model/fp-hit.ts';
import {hitOrd} from '#src/clashking/mappers/fp-ck.ts';
import {fpCkHits} from '#src/clashking/mappers/fp-ck-hits.ts';
import {stats} from '#src/model/pure-stats.ts';
import {toHits, toHitsStats} from '#src/model/fp-hits.ts';

export const fpCkWar = (us_tag: string) => (war: CK_War) => {
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
        rules: [war.preparationStartTime, war.startTime, war.endTime, war.teamSize, war.attacksPerMember],

        cids: [us.tag, vs.tag],
        nms : [us.name, vs.name],
        cls : [us.clanLevel, vs.clanLevel],

        score_attacks   : [us.attacks, vs.attacks],
        score_stars     : [us.stars, vs.stars],
        score_percentage: [us.destructionPercentage, vs.destructionPercentage],
        score_duration  : [us_duration, vs_duration],

        ms_mirrors: pipe(ms_mirrors, map(([u, v]) => [u.pos, u.thl, v.thl, u.thl - v.thl])),
        hits      : hits.right,
        hits_ms   : pipe(
            hits.right,
            reduceKVs('a_pid'),
        ),
        // hits_stats: pipe(hits.right, stats),
        defs   : hits.left,
        defs_ms: pipe(hits.right, reduceKVs('a_pid')),
    };
};
