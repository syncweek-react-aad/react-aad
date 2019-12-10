var path = require('path');
var webpack = require('webpack');
var package = require('./package');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Stylish = require('webpack-stylish');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const outputFolder = path.resolve(__dirname, 'dist/umd');
var PATHS = {
  entryPoint: path.resolve(__dirname, 'src/index.ts'),
  outputFolder,
  bundleReport: path.join(outputFolder, 'bundle_report.html'),
  bundleStats: path.join(outputFolder, 'bundle_stats.html'),
};

module.exports = {
  mode: 'production',
  entry: {
    'react-aad-msal': [PATHS.entryPoint],
    'react-aad-msal.min': [PATHS.entryPoint],
  },
  output: {
    path: PATHS.outputFolder,
    filename: '[name].js',
    library: 'react-aad-msal',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals: ['react', 'msal'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    // Outputs visualization interface which analyzes the contents of a bundle and
    // provides in-depth analysis of the size. ALso exports a stats JSON file
    // for use with third-party analyzers.
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: PATHS.bundleReport,
      generateStatsFile: false,
      statsFilename: PATHS.bundleStats,
      defaultSizes: 'gzip',
    }),
    new Stylish(),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            // eslint-disable-next-line camelcase
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
};
