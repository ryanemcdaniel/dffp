import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {ApplicationCommandOptionType, ApplicationCommandType} from 'discord-api-types/v10';
import {aliasClan} from '#src/discord/constants/alias.ts';
import type {SpecInput} from '#src/discord/types.ts';
import {buildDiscordCommand2} from '#src/discord/types.ts';
import {patchOriginal} from '#src/discord/api/patch-original.ts';
import {callDiscord} from '#src/discord/api/base.ts';
import {notFound} from '@hapi/boom';
import {dHeader1, dHeader2, dHeader3, dSubtext} from '#src/discord/messages/string-ops.ts';

const DEFAULT_LIMIT = 10;

export const WAR_LINKS_SPEC = {
    type       : ApplicationCommandType.ChatInput,
    name       : 'war-links',
    description: 'get player profile links of enemy top #10 for scouting',
    options    : [
        {
            type       : ApplicationCommandOptionType.String,
            name       : 'clan',
            description: 'tag or alias (ex. #2GR2G0PGG, main, labs, ctd, ...)',
            required   : true,
        },
        {
            type       : ApplicationCommandOptionType.Integer,
            name       : 'limit',
            description: 'number of player links starting from #1 (def: 10)',
        },
    ] as const,
} as const satisfies SpecInput;

export const WAR_LINKS = buildDiscordCommand2(WAR_LINKS_SPEC, async (discord, data, ops) => {
    const clanTag = aliasClan(ops.clan.value);

    const war = await api_coc.getCurrentWar({clanTag, round: 'CurrentRound'});

    if (!war || war.isWarEnded) {
        throw notFound('war data unavailable');
    }

    const limit = ops.limit?.value || DEFAULT_LIMIT;

    const players = war.opponent.members
        .sort((p1, p2) => p1.mapPosition - p2.mapPosition)
        .filter((_, idx) => idx < limit);

    const maxTag = players.reduce(
        (a, p) => a < p.tag.length
            ? p.tag.length
            : a,
        0,
    );

    const messageHeader
        = dHeader1(war.clan.name)
        + dHeader3(`vs ${war.opponent.name}`)
        + dSubtext('click the highlighted names to open in-game');

    const message = players.reduce(
        (acc, p, idx) => acc + dHeader3(`\`${(idx + 1).toString().padEnd(2)} | ${p.tag.padEnd(maxTag)} |\` [${p.name}](<${p.shareLink}>)`),
        messageHeader,
    );

    await callDiscord(patchOriginal(discord, data, message));
});
