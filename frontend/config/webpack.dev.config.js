const webpack = require("webpack");
const commonWebpackConfig = require("./webpack.common.config.js");


const devRules = [
  {
    test: /\.(sa|sc|c)ss$/,
    use: ["style-loader", "css-loader", "sass-loader"]
  }
];

const devPlugins = [
  new webpack.HotModuleReplacementPlugin()
]

module.exports = commonWebpackConfig.buildWebpackConfig(
  commonWebpackConfig.commonRules.concat(devRules),
  commonWebpackConfig.commonPlugins.concat(devPlugins),
  true
);
