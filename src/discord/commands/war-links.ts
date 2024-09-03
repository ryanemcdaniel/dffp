import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {DFFP_CLANS_ALIAS} from '#src/lambdas/temp-constants.ts';
import type {APIChatInputApplicationCommandInteraction} from 'discord-api-types/v10';
import {COMMANDS} from '#src/discord/commands.ts';

export const warLinks = [COMMANDS.WAR_LINK.name, async (body: APIChatInputApplicationCommandInteraction) => {
    const [{value: clan}] = body.data.options!.filter((o) => o.name === 'clan') as {value: string}[];

    const alias = clan.replaceAll(' ', '').toLowerCase();

    const clanTag = alias in DFFP_CLANS_ALIAS
        ? DFFP_CLANS_ALIAS[alias]
        : clan;

    const currentWar = await api_coc.getCurrentWar(clanTag);

    if (!currentWar) {
        return 'no current war data available';
    }

    if (currentWar.isWarEnded) {
        return 'current war has already ended';
    }

    const players = currentWar.opponent.members
        .sort((a, b) => a.mapPosition - b.mapPosition)
        .filter((_, idx) => idx < 10)
        .map((m, idx) => [idx + 1, m.tag, m.name, m.shareLink] as const);

    const [maxIdx, maxTag, maxName] = [
        players.reduce((a, [idx]) => a < idx.toString().length
            ? idx.toString().length
            : a, 0),
        players.reduce((a, [,tag]) => a < tag.length
            ? tag.length
            : a, 0),
    ];

    const message = players.reduce(
        (acc, [idx, tag, name, link]) => acc
            .concat([`### \`${idx.toString().padEnd(maxIdx)}`])
            .concat([` | ${tag.padEnd(maxTag)}`])
            .concat([` |\` [${name}](<${link}>)\n`]),
        [`# ${currentWar.clan.name} vs. ${currentWar.opponent.name}\n`]
            .concat(['-# click the highlighted names to open in-game\n']),
    );

    return message;
}] as const;