const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  entry: {
    "server": path.resolve(__dirname, "src/server/index.ts"),
    "setup": path.resolve(__dirname, "src/setup/index.ts")
  },
  target: "node",
  externals: [nodeExternals()],
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    alias: {
      "src": path.resolve(__dirname, "src")
    },
    extensions: [".ts", ".js"]
  }
};
