import { build, BuildOutput } from "bun";

function b(format: "esm" | "cjs" | "iife", entry: string = "./src/index.ts"): Promise<BuildOutput>{
    return build({
        entrypoints: [entry],
        outdir: "./dist",
        target: "node",
        format,
        minify: true,
        sourcemap: "linked",
        naming: `[dir]/${format}.[ext]`
    })
}
b("esm")
b("cjs")
b("iife", "./src/_iife.js");
