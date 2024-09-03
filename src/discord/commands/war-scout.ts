import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';
import {buildGraphModel} from '#src/data/build-graph-model.ts';

export const warScout = buildCommand(COMMANDS.WAR_SCOUT, async (body) => {
    const graphModel = await buildGraphModel(body.data.options.clan);

    return {
        title: graphModel.currentWar.clan.name,
        desc : [graphModel.currentWar.clan.name],
    };
});
