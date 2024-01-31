import esbuild from 'esbuild';

esbuild.buildSync({
    entryPoints: [
        { out: "flex", in: "src/index.ts" }
    ],
    bundle: true,
    platform: "neutral",
    define: { IS_DEV: "false" },
    outdir: "test"
});