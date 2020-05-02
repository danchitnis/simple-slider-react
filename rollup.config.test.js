//https://github.com/almerino/create-react-rollup-app/blob/master/rollup.config.js

import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import replace from "rollup-plugin-replace";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const devOutput = [
  {
    dir: "public/dist/module",
    format: "es",
    sourcemap: true,
  },
];

const prodOutput = [
  devOutput,
  {
    dir: "public/dist/nomodule",
    format: "system",
    sourcemap: true,
  },
];

export default {
  input: ["test/index.tsx"],
  output: false ? prodOutput : devOutput,
  plugins: [
    resolve({
      browser: true,
      extensions: [".js", ".jsx", ".json", ".tsx"],
    }),
    typescript(),
    commonjs({
      include: ["node_modules/**"],
      exclude: ["node_modules/process-es6/**"],
      namedExports: {
        react: ["useState", "useEffect", "useRef", "useLayoutEffect"],
        "react-dom": ["render"],
      },
    }),
    babel({
      exclude: "node_modules/**",
    }),
    replace({
      "process.env.NODE_ENV": production
        ? JSON.stringify("production")
        : JSON.stringify("development"),
    }),
  ],
};
