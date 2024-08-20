export const toObjKeyedBy = (key: string) => (acc, val) => {
    acc[val[key]] = val;
    return acc;
};

export const sortyBy = (...keys: string[]) => (a, b) => {
    keys.reduce((acc, k) => {
        if (a[k] > b[k]) {
        }
    }, false);

    if (a[key] > b[key]) {
        return 1;
    }
    if (a[key] === b[key]) {
        return 0;
    }
    return -1;
};
