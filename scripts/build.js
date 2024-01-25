import esbuild from 'esbuild';

await esbuild.build({
    entryPoints: [
        { out: "flex", in: "src/index.js" }
    ],
    bundle: true,
    platform:"neutral",
    define: { IS_DEV: "false" },
    outdir: "dist",
});

await esbuild.build({
    entryPoints: [
        { out: "flex.min", in: "src/index.js" }
    ],
    bundle: true,
    format: "iife",
    minify: true,
    define: { IS_DEV: "false" },
    outdir: "dist",
});