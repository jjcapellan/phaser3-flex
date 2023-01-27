import esbuild from 'esbuild';

esbuild.buildSync(
    {
        entryPoints: ['src/index.js'],
        bundle: true,
        minify: true,
        outfile: 'dist/phaser3-fbx.js'
    }
);