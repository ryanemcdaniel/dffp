import {Context} from "aws-lambda";


interface Ctx<C> {
}

interface Trigger<E, R, C> {
    event: E;
    ctx: Ctx<C>;
    aws: Context;
}

interface BindLambda<E, R, C> {
    init: () => Promise<Ctx<C>>
    main: (trigger: Trigger<E, R, C>) => Promise<R>
}


export const bindLambda = <E, R, C>(ops: BindLambda<E, R, C>) => {

    const ctx = ops.init();

    let timeoutId: NodeJS.Timeout;

    const {main} = ops;

    return async (event: E, aws: Context): Promise<R> => {

        const trigger = {
            event,
            ctx: await ctx,
            aws
        }

        const [after] = await Promise.race([
            main(trigger),
            new Promise((_, reject) => {
                timeoutId = setTimeout(
                    () => {
                        clearTimeout(timeoutId);
                        reject(new Error('timeout'))
                    },
                    aws.getRemainingTimeInMillis() - 10000,
                );
            })
        ] as const) as [Promise<R>];

        clearTimeout(timeoutId)



        return after;
    }
}