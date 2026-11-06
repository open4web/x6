import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';

const appVersion = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf-8')).version;

const packages = fs.readdirSync(path.resolve(__dirname, './packages'));
const aliases = packages.reduce((acc, dirName) => {
    const packageJson = require(path.resolve(
        __dirname,
        './packages',
        dirName,
        'package.json'
    ));
    acc[packageJson.name] = path.resolve(
        __dirname,
        `${path.resolve('./')}/packages/${packageJson.name}/src`
    );
    return acc;
}, {});

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(({ command, mode }) => {
    const isBuild = command === 'build';
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    const defineEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(env)) {
        defineEnv[`import.meta.env.${key}`] = JSON.stringify(value);
    }
    // Keep a tiny process.env shim for libraries that still read NODE_ENV.
    defineEnv['process.env.NODE_ENV'] = JSON.stringify(isBuild ? 'production' : mode);

    const alias: { find: string; replacement: string }[] = [];
    if (!isBuild && process.env.VITE_REACT_PROFILING === '1') {
        alias.push(
            { find: 'react-dom', replacement: 'react-dom/profiling' },
            { find: 'scheduler/tracing', replacement: 'scheduler/tracing-profiling' },
        );
    }

    return {
        plugins: [react()],
        define: {
            ...defineEnv,
            __APP_VERSION__: JSON.stringify(appVersion),
        },
        server: {
            port: 8000,
            proxy: {
                [loadEnv('development', process.cwd()).VITE_APP_BASE_API]: {
                    target: loadEnv('development', process.cwd()).VITE_APP_REAL_API,
                    changeOrigin: true,
                    rewrite: path => {
                        const apiString = loadEnv('development', process.cwd()).VITE_APP_BASE_API
                        const envApi = new RegExp(apiString, 'g')
                        return path.replace(envApi, '')
                    },
                },
                '/api': {
                    target: 'http://shop.r2day.club/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
        base: './',
        esbuild: {
            keepNames: !isBuild,
        },
        build: {
            sourcemap: isBuild ? 'hidden' : true,
            chunkSizeWarningLimit: 100,
            rollupOptions: {
                onwarn(warning, warn) {
                    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                        return
                    }
                    warn(warning)
                },
            },
        },
        resolve: {
            preserveSymlinks: true,
            alias,
        },
    };
});
