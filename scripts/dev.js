import esbuild from 'esbuild';

let ctx = await esbuild.context({
    entryPoints: [
        { out: "flex", in: "src/index.js" }
    ],
    bundle: true,
    platform:"neutral",
    define: { IS_DEV: "true" },
    outdir: "dist",
});

await ctx.watch();

let { host, port } = await ctx.serve({
    servedir: "./",
});
console.log(`Starting local server at port ${port}`);