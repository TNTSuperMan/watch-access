export type Func<Args extends Array<unknown>, Return extends unknown, This extends unknown> = (this: This, ...args: Args) => Return;
export type FunctionReporter<Args extends Array<unknown>, Return extends unknown, This extends unknown>
    = (target: Func<Args, Return, This>, ret: Return, ...args: Args)=>void;

export const createWrappedFunction = <Args extends Array<unknown>, Return extends unknown, This extends unknown>
    (target: Func<Args, Return, This>,
        report: FunctionReporter<Args, Return, This> ): Func<Args, Return, This> => 
    function(...args){
        const res = target.call(this, ...args)
        report(target, res, ...args);
        return res;
    }
