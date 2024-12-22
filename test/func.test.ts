import { expect, it } from "bun:test";
import { watchFn } from "../src"

it("Cal function", ()=>{
    const r: any[][] = [];
    const add = watchFn((a,b)=>a+b, (e,...args)=>r.push(args))
    add(1,2);
    expect(r.length).toBe(1);
    expect(r[0][0]).toBe(3); //ret
    expect(r[0][1]).toBe(1); //arg1
    expect(r[0][2]).toBe(2); //arg2
})