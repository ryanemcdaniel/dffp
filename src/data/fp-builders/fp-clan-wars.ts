import {flow, pipe} from 'fp-ts/function';
import type {GuessHigherKind2, Override} from '#src/pure/pure.ts';
import type {War} from '#src/data/fp-builders/fp-clan-war.ts';
import {fromEntries, toEntries} from 'fp-ts/Record';
import {concat, foldMap, map} from 'fp-ts/Array';
import type {Monoid} from 'fp-ts/Monoid';

export type Wars = Override<GuessHigherKind2<War>, {}>;

const EMPTY_WARS = {
    rules_prep            : [],
    rules_start           : [],
    rules_end             : [],
    rules_team            : [],
    rules_natks           : [],
    cid                   : [],
    name                  : [],
    clvl                  : [],
    score_attacks         : [],
    score_stars           : [],
    score_percentage      : [],
    score_duration        : [],
    other_cid             : [],
    other_name            : [],
    other_clvl            : [],
    other_score_attacks   : [],
    other_score_stars     : [],
    other_score_percentage: [],
    other_score_duration  : [],
    mirror_diff           : [],
    hits                  : [],
    defs                  : [],
} satisfies Wars;

const WarsMonoid = {
    empty : EMPTY_WARS,
    concat: (h1, h2) => pipe(
        h1,
        toEntries,
        map(([hk, h1v]) => [hk, concat(h1v)(h2[hk])]),
        fromEntries,
    ),
} as const satisfies Monoid<Wars>;

export const toWars = flow(foldMap(WarsMonoid)((w: War) => ({
    rules_prep            : [w.rules_prep],
    rules_start           : [w.rules_start],
    rules_end             : [w.rules_end],
    rules_team            : [w.rules_team],
    rules_natks           : [w.rules_natks],
    cid                   : [w.cid],
    name                  : [w.name],
    clvl                  : [w.clvl],
    score_attacks         : [w.score_attacks],
    score_stars           : [w.score_stars],
    score_percentage      : [w.score_percentage],
    score_duration        : [w.score_duration],
    other_cid             : [w.other_cid],
    other_name            : [w.other_name],
    other_clvl            : [w.other_clvl],
    other_score_attacks   : [w.other_score_attacks],
    other_score_stars     : [w.other_score_stars],
    other_score_percentage: [w.other_score_percentage],
    other_score_duration  : [w.other_score_duration],
    mirror_diff           : [w.mirror_diff],
    hits                  : [w.hits],
    defs                  : [w.defs],
})));

const WarsLattice = {
    join: (w1, w2) => ({}),
    meet: (w1, w2) => ({}),
} as const satisfies Wars;
