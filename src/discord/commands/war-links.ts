import {COMMANDS} from '#src/discord/commands.ts';
import {buildCommand} from '#src/discord/types.ts';
import {pipe} from 'fp-ts/function';
import {fromCompare} from 'fp-ts/Ord';
import {OrdN} from '#src/data/pure.ts';
import type {ClanWarMember} from 'clashofclans.js';
import {dBold, dCode, dEmpL, dHdr3, dLine, dLink, dSubH, nNatT} from '#src/discord/command-util/message.ts';
import {concatL, mapL, sortL} from '#src/data/pure-list.ts';
import {dTable} from '#src/discord/command-util/message-table.ts';
import {fetchCurrentClanWar} from '#src/discord/command-util/fetch-current.ts';

export const warLinks = buildCommand(COMMANDS.WAR_LINK, async (body) => {
    const war = await fetchCurrentClanWar(body.data.options.clan);

    const opponentMembers = pipe(
        war.opponent.members,
        sortL(fromCompare<ClanWarMember>((a, b) => OrdN.compare(a.mapPosition, b.mapPosition))),
    );

    return [{
        title: '',
        desc : pipe(
            [
                dHdr3(`${war.clan.name} vs. ${war.opponent.name}`),
                dLink('click to open opponent clan in-game', war.opponent.shareLink),
                dEmpL(),
            ],
            concatL(pipe(
                [['wr', 'th', 'tag', 'name/link']],
                concatL(pipe(opponentMembers, mapL((m) =>
                    [nNatT(m.mapPosition), nNatT(m.townHallLevel), m.tag, dCode(dBold(dLink(m.name, m.shareLink)))],
                ))),
                dTable,
                mapL(dCode),
            )),
            concatL([dSubH('click the highlighted names to open in-game')]),
            mapL(dLine),
        ),
    }];
});
