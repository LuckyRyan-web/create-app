import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
// 引入外部包
import resolve from '@rollup/plugin-node-resolve'
// 解析 cjs 格式的包
import commonjs from '@rollup/plugin-commonjs'
// 压缩插件
// import { terser } from 'rollup-plugin-terser'

import eslint from '@rollup/plugin-eslint'

// 解决依赖打包进来的问题
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const packageJson = require('./package.json')

export default [
    {
        input: 'src/index.ts',
        external: Object.keys(packageJson.dependencies || {}),
        plugins: [
            peerDepsExternal(),
            resolve(),
            eslint({
                throwOnError: true,
            }),
            commonjs(),
            typescript(),
            json(),
        ],
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
            },
            {
                file: packageJson.module,
                format: 'es',
            },
        ],
        // output: [
        //     {
        //         file: 'dist/index.umd.js',
        //         format: 'umd',
        //         name: 'Index',
        //         plugins: [terser()],
        //         banner: '/** Hello this is my utils */',
        //     },
        //     {
        //         file: 'dist/index.es.js',
        //         format: 'es',
        //         // plugins: [terser()],
        //     },
        // ],
    },
]
