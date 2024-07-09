export const detectTimeout = async <T>(promise: Promise<T>, timeout_ms: number): Promise<T> => {
    let timeoutId: NodeJS.Timeout;

    return await Promise
        .race([
            promise,
            new Promise<T>((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error(`timeout exceeded`));
                }, timeout_ms)
            })
        ])
        .finally(() => clearTimeout(timeoutId))
}
