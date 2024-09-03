export const initEmbedAcc = (title: string, desc: string) => ({
    title,
    desc : [desc] as string[],
    foot : [] as string[],
    maxes: {} as Record<string, number>,
} as const);
