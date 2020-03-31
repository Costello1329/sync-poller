const commonWebpackConfig = require("./webpack.common.config.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const buildRules = [
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      "style-loader",
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader"
      },
      "sass-loader"
    ]
  }
];

module.exports = commonWebpackConfig.buildWebpackConfig(
  commonWebpackConfig.commonRules.concat(buildRules),
  commonWebpackConfig.commonPlugins,
  false
);
