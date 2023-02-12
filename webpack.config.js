const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => {
  const devMode = "production";

  const srcDir = "./src/";
  const destDir = "dist";

  const buildFilePath = (modulePath) => {
    // skidam "/" sa početka i kraja stringa
    if (modulePath[0] !== "/") modulePath = `/${modulePath}`;
    if (modulePath.length > 1 && modulePath[modulePath.length - 1] !== "/") modulePath = `${modulePath}/`;

    return `.${modulePath}script/` + (devMode ? `[name]Entry.js` : `entry.[contenthash].js`);
  };

  const config = {
    entry: {
      main: { import: srcDir + "index.tsx", filename: buildFilePath("/") },
      sisCategory: {
        import: srcDir + "sisCategory.tsx",
        filename: buildFilePath("/sisCategory"),
      },
      sisCountry: {
        import: srcDir + "sisCountry.tsx",
        filename: buildFilePath("/sisCountry"),
      },
    },
    mode: "production",
    output: {
      path: path.resolve(__dirname + "/" + destDir),
    },
    // u dev okruženju kreiram brze "eval" source maps
    // u produkciji kreiram prave source-mape koje će biti uploadane na Raygun
    devtool: devMode ? "eval-source-map" : "source-map",
    devServer: {
      port: 3030, // you can change the port
      historyApiFallback: true,
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)?$/,
          use: ["ts-loader", path.resolve(__dirname, "img-loader-bash.js")],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].[ext]",
                outputPath: (url, resourcePath) => resourcePath.replace(path.resolve(__dirname, "src"), ""),
                publicPath: (url, resourcePath) => `/img/${url.replace(/src\/img\//, "")}`,
              },
            },
          ],
        },
        {
          test: /\.(scss|css)$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: "css-loader",
              options: {
                esModule: false, // nemoj kopirati slike sa hashanim imenom -> disablea ECMAScript i koristi commonJS module,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      extensions: [".js", ".jsx", ".tsx", ".ts"],
    },

    plugins: [
      new MiniCssExtractPlugin({
        // slijedeće pravilo definira naziv entrypoint datoteke koja se učita na početku
        filename: devMode ? `style/[name].css` : `style/[name].[contenthash].css`,
        // slijedeće pravilo definira naziv imena chunk datoteka koje će biti učitate naknadno prema potrebi
        chunkFilename: devMode ? `style/[name].css` : `style/[name].[contenthash].css`,
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["dist"],
      }),
    ],

    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
  };

  return config;
};
