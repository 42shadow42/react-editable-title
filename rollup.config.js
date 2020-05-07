import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

export default {
    input: 'src/index.tsx',
    output: {
        format: 'cjs',
        dir: 'dist',
        sourcemap: true
    },
    external: [
        'react',
        'classnames/bind'
    ],
    plugins: [
        postcss(),
        typescript()
    ]
};