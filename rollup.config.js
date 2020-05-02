import typescript from "rollup-plugin-typescript2";
import sass from "rollup-plugin-sass";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";

import packageJson from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "./dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    typescript(),
    commonjs({
      namedExports: {
        react: ["useState", "useEffect", "useRef", "useLayoutEffect"],
      },
    }),
    sass({
      insert: true,
    }),
  ],
};
