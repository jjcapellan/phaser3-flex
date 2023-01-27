import esbuild from 'esbuild';

esbuild.buildSync(
    {
        entryPoints: ['demo/index.js'],
        bundle: true,
        minify: true,
        outfile: 'demo/dist/demo.js'
    }
);