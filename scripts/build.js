import esbuild from 'esbuild';

let msg = "";

let endMessage = {
    name: 'end-msg',
    setup(build) {
        const options = build.initialOptions;
        msg = options.platform == "neutral" ? "ESM build completed --> flex.js" : "Browser build completed --> flex.min.js";

        build.onEnd(result => {
            console.log(msg);
        });
    }

};

await esbuild.build({
    entryPoints: [
        { out: "flex", in: "src/index.ts" }
    ],
    bundle: true,
    platform: "neutral",
    define: { IS_DEV: "false" },
    outdir: "dist",
    plugins: [endMessage]
});

await esbuild.build({
    entryPoints: [
        { out: "flex.min", in: "src/index.ts" }
    ],
    bundle: true,
    format: "iife",
    minify: true,
    define: { IS_DEV: "false" },
    outdir: "dist",
    plugins: [endMessage]
});