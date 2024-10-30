import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    peerDepsExternal(),
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      jsx: 'preserve',
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],  // Ensures Babel processes TSX files
    }),
  ],
  external: ['react', 'react-dom'],
};
