import esbuild from 'esbuild';

esbuild.buildSync(
    {
        entryPoints: ['src/index.js'],
        bundle: true,
        minify: false,
        outfile: 'demo/devbuild/phaser3-fbx.js'
    }
);