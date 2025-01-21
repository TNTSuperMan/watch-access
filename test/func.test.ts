import { expect, it } from "bun:test";
import { watchFn, watchObj } from "../src"

it("Call function", ()=>{
    const r: any[][] = [];
    const add = watchFn<[number, number], number, any>((a,b)=>a+b, (e,...args)=>r.push(args))
    add(1,2);
    expect(r.length).toBe(1);
    expect(r[0][0]).toBe(3); //ret
    expect(r[0][1]).toBe(1); //arg1
    expect(r[0][2]).toBe(2); //arg2
})

it("Proxy function", ()=>{
    const objlog: [PropertyKey, unknown, boolean][] = [];
    const fnclog: [Function, string, any, ...any][] = [];
    const fnobj = watchObj({
        add(a: number, b: number){return a+b}
    }, (...args)=>objlog.push(args), {
        funcReporter: (...args) => fnclog.push(args)
    })
    fnobj.add(1,2);

    expect(objlog.length).toBe(1);
    expect(objlog[0][0]).toBe("add");
    expect(objlog[0][2]).toBe(false);

    expect(fnclog.length).toBe(1);
    expect(fnclog[0].length).toBe(5);
    expect(fnclog[0][1]).toBe("add");
    expect(fnclog[0][2]).toBe(3);
    expect(fnclog[0][3]).toBe(1);
    expect(fnclog[0][4]).toBe(2);
})

it("Nested Proxy function", ()=>{
    const objlog: [PropertyKey, unknown, boolean][] = [];
    const fnclog: [Function, string, any, ...any][] = [];
    const fnobj = watchObj({
        funcs: {
            add(a: number, b: number){return a+b}
        }
    }, (...args)=>objlog.push(args), {
        funcReporter: (...args) => fnclog.push(args)
    })
    fnobj.funcs.add(1,2);

    expect(objlog.length).toBe(2);
    expect(objlog[0][0]).toBe("funcs");
    expect(objlog[0][2]).toBe(false);
    expect(objlog[1][0]).toBe("funcs.add");
    expect(objlog[1][2]).toBe(false);

    expect(fnclog.length).toBe(1);
    expect(fnclog[0].length).toBe(5);
    expect(fnclog[0][1]).toBe("funcs.add");
    expect(fnclog[0][2]).toBe(3);
    expect(fnclog[0][3]).toBe(1);
    expect(fnclog[0][4]).toBe(2);
})
