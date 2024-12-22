import { build, BuildOutput } from "bun";

function b(format: "esm" | "cjs" | "iife"): Promise<BuildOutput>{
    return build({
        entrypoints: ["./src/index.ts"],
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
