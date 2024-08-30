import {ApplicationCommandOptionType, ApplicationCommandType} from 'discord-api-types/v10';
import {buildDiscordCommand2, type SpecInput} from '#src/discord/types.ts';
import {ck_getPreviousWars} from '#src/clashking/api/get-war.ts';
import {aliasClan} from '#src/discord/constants/alias.ts';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {notFound, unauthorized} from '@hapi/boom';
import {callDiscord} from '#src/discord/api/base.ts';
import {patchOriginal} from '#src/discord/api/patch-original.ts';
import {pipe} from 'fp-ts/function';
import {fromCkWar} from '#src/data/ingest/ingest-cking-war.ts';
import {map} from 'fp-ts/Array';

export const WAR_OPPONENT_SPEC = {
    type       : ApplicationCommandType.ChatInput,
    name       : 'war-opponent',
    description: 'TBD',
    options    : [
        {
            type       : ApplicationCommandOptionType.String,
            name       : 'clan',
            description: 'tag or alias (ex. #2GR2G0PGG, main, labs, ctd, ...)',
            required   : true,
        },
    ] as const,
} as const satisfies SpecInput;

export const WAR_OPPONENT = buildDiscordCommand2(WAR_OPPONENT_SPEC, async (discord, interaction, ops) => {
    const clanTag = aliasClan(ops.clan.value);
    const currentWar = await api_coc.getCurrentWar({clanTag, round: 'CurrentRound'});

    if (interaction.member?.user.id !== '644290645350940692') {
        throw unauthorized('Unauthorized');
    }

    if (!currentWar || currentWar.isWarEnded) {
        throw notFound('war data unavailable');
    }

    const previousWars = await ck_getPreviousWars(currentWar.opponent.tag);

    const stats = pipe(
        previousWars.contents,
        map(fromCkWar),

    );

    await callDiscord(patchOriginal(
        discord,
        interaction,
        'unfinished',
    ));
});
