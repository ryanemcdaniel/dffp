export const getFrom = (body) => {
    const from = Number(String(body.data.options.from ?? '1'));

    return from;
};

export const getTo = (body) => {
    const to = Number(String(body.data.options.to ?? '50'));

    return to;
};

export const getLimit = (body) => {
    return Number(String(body.data.options.limit ?? '50'));
};

export const getNShow = (body) => {
    return Boolean(body.data.options.nshow);
};

export const getExhaustive = (body) => {
    return Boolean(body.data.options.exhaustive);
};

export const getPlayerInfo = (body) => {
    return Boolean(body.data.options.latest);
};
