import typescript from "rollup-plugin-typescript2";

const packageJson = require("./package.json");
const deps = Object.keys(packageJson.dependencies || {});
const peers = Object.keys(packageJson.peerDependencies || {});
const external = deps.concat(peers);

export default {
  input: "src/index.ts",
  external,
  output: [
    {
      file: "build/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [typescript({ tsconfig: "tsconfig.json" })],
};
