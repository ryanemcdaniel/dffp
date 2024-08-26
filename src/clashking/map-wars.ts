import type {CK_War} from '#src/clashking/api/get-war.ts';

export const mapWars = (clan: string, wars: CK_War[]) => {
    return wars.map((war, idx) => {
        const [us_clan, vs_clan] = war.clan.tag === clan
            ? [war.clan.tag, war.opponent.tag]
            : [war.opponent.tag, war.clan.tag];

        const all = [
            ...war.clan.members.map((m) => ({...m, clanTag: us_clan})),
            ...war.opponent.members.map((m) => ({...m, clanTag: vs_clan})),
        ];

        const members = all.reduce<Record<string, typeof all>>((acc, m) => {
            acc[m.tag] = [m];
            acc[m.clanTag] ??= [];
            acc[m.clanTag].push(m);
            return acc;
        }, {});

        members[war.clan.tag].sort((m1, m2) => m1.mapPosition - m2.mapPosition);
        members[war.opponent.tag].sort((m1, m2) => m1.mapPosition - m2.mapPosition);

        const hits_order = all
            .map((m) => m.attacks?.map((a) => ({
                order            : a.order,
                attacker_clan_tag: m.clanTag,
                attacker_tag     : a.attackerTag,
                attacker_pos     : m.mapPosition,
                attacker_th      : m.townhallLevel,
                defender_clan_tag: members[a.defenderTag][0].tag,
                defender_tag     : a.defenderTag,
                defender_pos     : members[a.defenderTag][0].mapPosition,
                defender_th      : members[a.defenderTag][0].townhallLevel,
                duration         : a.duration,
                stars            : a.stars,
                destruction      : a.destructionPercentage,
            })) ?? [])
            .flat()
            .sort((a1, a2) => a1.order - a2.order)
            .reduce((acc, h) => {
                const ore = acc.three[h.defender_tag] ?? false;
                const th_diff = h.defender_th - h.attacker_th;
                const cc_reveal = !ore && th_diff >= 2;

                h.ore = ore;
                h.cc_reveal = cc_reveal;
                h.th_diff = th_diff;
                h.pos_diff = h.defender_pos - h.attacker_pos;

                acc.order.push(h);

                if (h.stars === 3) {
                    acc.three[h.defender_tag] = true;
                }

                return acc;
            }, {three: {}, order: []})
            .order;

        return {
            war_idx       : idx,
            attacks       : war.attacksPerMember,
            size          : war.teamSize,
            prep          : war.preparationStartTime,
            start         : war.startTime,
            end           : war.startTime,
            hits_order,
            members,
            mirror_th_diff: members[war.clan.tag].map((m, idx) => ({
                pos    : m.mapPosition,
                us_clan: m.clanTag,
                us_play: m.tag,
                us_th  : m.townhallLevel,
                vs_clan: members[war.opponent.tag][idx].clanTag,
                vs_play: members[war.opponent.tag][idx].tag,
                vs_th  : members[war.opponent.tag][idx].townhallLevel,
                th_diff: members[war.opponent.tag][idx].townhallLevel - m.townhallLevel,
            })),
        };
    });
};

// const hits = {
//     wars    : {},
//     attacker: {},
//     defender: {},
// };
//
// let warIdx = 0;
//
// for (const war of wars) {
//     const clan = {} as Record<number | string, CK_War['clan']['members'][number]>;
//     const hits = {} as Record<number | string, CK_War['opponent']['members'][number]['attacks']>;
//     const defs = {} as Record<number | string, CK_War['opponent']['members'][number]['attacks']>;
//     const vsClan = {} as Record<number | string, CK_War['opponent']['members'][number]>;
//
//     for (const member of war.clan.members) {
//         clan[member.mapPosition] ??= member;
//         clan[member.tag] ??= member;
//         for (const attack of member.attacks ?? []) {
//             hits[attack.order] = [attack];
//             hits[attack.attackerTag] ??= [];
//             hits[attack.attackerTag]?.push(attack);
//         }
//     }
//
//     for (const member of war.clan.members) {
//         vsClan[member.mapPosition] ??= member;
//         vsClan[member.tag] ??= member;
//         for (const attack of member.attacks ?? []) {
//             hits[attack.order] = [attack];
//             defs[attack.defenderTag] ??= [];
//             defs[attack.defenderTag]?.push(attack);
//         }
//     }
//
//     for (const hit of hits) {
//         hits[] = [];
//     }
//
//     for (const def of def) {
//
//     }
//
//     warIdx++;
// }
