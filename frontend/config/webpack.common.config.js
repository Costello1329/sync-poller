const webpack = require("webpack");

const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = 
  require("optimize-css-assets-webpack-plugin");
// const LoadablePlugin = require("@loadable/webpack-plugin");


const commonRules = [
  {
    test: /\.tsx?$/,
    loader: "ts-loader",
    options: {
      configFile: "config/tsconfig.json"
    }
  },
  {
    test: /\.html$/,
    use: [
      {
        loader: "html-loader",
        options:
        {
          minimize: true
        }
      }
    ]
  },
  {
    test: /\.ttf$/,
    use: [
      {
        loader: "file-loader",
        options: {
            outputPath: "assets"
        }
      }
    ]
  },
  {
    test: /\.png$/,
    use: [
      {
        loader: "file-loader",
        options: {
          outputPath: "assets"
        }
      }
    ]
  }
];

const commonPlugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new MiniCssExtractPlugin({
    filename: "assets/a[hash:7].css",
    chunkFilename: "assets/v[id][contenthash:6].css"
  }),
  new HtmlWebPackPlugin({
    template: "./public/index.html",
    filename: "./index.html",
    // favicon: "./public/favicon.ico"
  }),
  // new LoadablePlugin({ filename: "stats.json", writeToDisk: true })
];

function buildWebpackConfig (rules, plugins, development) {
  return {
    mode: development ? "development" : "production",
    entry: "./src/index.tsx",
    
    output: {
      path: `${__dirname}/../build`,
      publicPath: "/",
      filename: "assets/a[hash:7].js",
      chunkFilename: "assets/v[id][contenthash:7].js"
    },
  
    module: {
      rules
    },
  
    resolve: {
      modules: ["../src", "node_modules"],
      extensions: [".css", "sass", ".scss", ".ts", ".tsx", ".js", ".json"]
    },
  
    plugins,
  
    optimization: {
      minimizer: [
        new TerserJSPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
  
    devtool: development ? "cheap-module-eval-source-map" : false,
    
    devServer: {
      contentBase: "./build",
      compress: true,
      disableHostCheck: true,
      historyApiFallback: true,
      hot: true,
      port: 1329,
      host: "127.0.0.1"
    },
  
    /*stats: {
      all: true,
      children: false,
      chunks: false,
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: false,
      moduleTrace: true,
      errorDetails: true
    }*/
  };
  
}

module.exports = {
  commonRules: commonRules,
  commonPlugins: commonPlugins,
  buildWebpackConfig: buildWebpackConfig
}
