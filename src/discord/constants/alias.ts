export const ALIAS_DFFP_CLANS = {
    dffp          : '#2GR2G0PGG',
    main          : '#2GR2G0PGG',
    labs          : '#2GYYRUULL',
    dffplabs      : '#2GYYRUULL',
    ctd           : '#2YVCYUCCP',
    ctdummy       : '#2YVCYUCCP',
    dummy         : '#2YVCYUCCP',
    clashtestdummy: '#2YVCYUCCP',
    ezcwl         : '#2QUP9UPGY',
} as const;

export const aliasClan = (tag: string): string => {
    const maybeAlias = tag.replaceAll(' ', '').toLowerCase() as keyof typeof ALIAS_DFFP_CLANS;

    if (maybeAlias in ALIAS_DFFP_CLANS) {
        return ALIAS_DFFP_CLANS[maybeAlias];
    }

    return tag;
};
