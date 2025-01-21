import { createProxy } from "./proxy";

export const recommandedWatch = <T extends object>(target: T, name: string): T =>
    createProxy(target, (p, v, s) => 
            console.trace(`${s ? "SET" : "GET"}: ${p} = ${v}`), {
        doWatchOnReporter: false,
        isShallow: false,
        _path: name,
        funcReporter(target, path, res, ...args) {
            console.trace(`CAL: `, target, ` ${path}(`, args, ") = ", res)
        },
    })