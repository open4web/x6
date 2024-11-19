import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';

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
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    server: { // 开发服务器配置
        port: 8000, // 开发服务器端口
        proxy: {
            [loadEnv('development', process.cwd()).VITE_APP_BASE_API]: {
                target: loadEnv('development', process.cwd()).VITE_APP_REAL_API,
                // target: 'http://localhost:3003', // animal_server
                changeOrigin: true,
                rewrite: path => {
                    const apiString = loadEnv('development', process.cwd()).VITE_APP_BASE_API
                    const envApi = new RegExp(apiString, 'g')
                    return path.replace(envApi, '')
                },
            },
            '/api': {
                target: 'http://shop.r2day.club/',
                changeOrigin: true, // 是否跨域
                rewrite: (path) => {
                  return path.replace(/^\/api/, '');
                }
            },
        },
    },
    base: './',
    esbuild: {
        keepNames: true,
    },
    build: {
        sourcemap: true,
        chunkSizeWarningLimit: 100,
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return
                }
                warn(warning)
            }}
    },
    resolve: {
        preserveSymlinks: true,
        alias: [
            // allow profiling in production
            { find: 'react-dom', replacement: 'react-dom/profiling' },
            {
                find: 'scheduler/tracing',
                replacement: 'scheduler/tracing-profiling',
            },
            // we need to manually follow the symlinks for local packages to allow deep HMR
            // ...Object.keys(aliases).map(packageName => ({
            //     find: packageName,
            //     replacement: aliases[packageName],
            // })),
        ],
    },
});
