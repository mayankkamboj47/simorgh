/* eslint-disable global-require */
const crypto = require('crypto');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const { DuplicatesPlugin } = require('inspectpack/plugin');
const { getClientEnvVars } = require('./src/clientEnvVars');

const FRAMEWORK_BUNDLES = ['react', 'react-dom'];
const TOTAL_PAGES = 13;
const DOT_ENV_CONFIG = dotenv.config();

if (DOT_ENV_CONFIG.error) {
  throw DOT_ENV_CONFIG.error;
}

module.exports = ({
  resolvePath,
  IS_PROD,
  START_DEV_SERVER,
  IS_PROD_PROFILE,
}) => {
  const APP_ENV = process.env.SIMORGH_APP_ENV || 'live';
  const webpackDevServerPort = 1124; // arbitrarily picked. Has to be different to server port (7080)
  const prodPublicPath =
    process.env.SIMORGH_PUBLIC_STATIC_ASSETS_ORIGIN +
    process.env.SIMORGH_PUBLIC_STATIC_ASSETS_PATH;

  const clientConfig = {
    target: 'web', // compile for browser environment
    entry: START_DEV_SERVER
      ? [
          `webpack-dev-server/client?http://localhost:${webpackDevServerPort}`,
          'webpack/hot/only-dev-server',
          './src/client',
        ]
      : ['./src/poly', './src/client'],
    devServer: {
      host: 'localhost',
      port: webpackDevServerPort,
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
    },
    output: {
      path: resolvePath('build/public'),
      /**
       * Need unhashed client bundle when running dev server.
       * Though we're no longer using Razzle, there is a good explanation here:
       * https://github.com/jaredpalmer/razzle/tree/master/packages/create-razzle-app/templates/default#how-razzle-works-the-secret-sauce
       */
      filename: START_DEV_SERVER
        ? 'static/js/[name].js'
        : 'static/js/[name].[chunkhash:8].js', // hash based on the contents of the file
      // need full URL for dev server & HMR: https://github.com/webpack/docs/wiki/webpack-dev-server#combining-with-an-existing-server
      publicPath: START_DEV_SERVER
        ? `http://localhost:${webpackDevServerPort}/`
        : prodPublicPath,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // These options are enabled in production profile builds only and
            // prevent the discarding or mangling of class and function names.
            keep_classnames: IS_PROD_PROFILE,
            keep_fnames: IS_PROD_PROFILE,
          },
        }),
      ],
      // specify min/max file sizes for each JS chunk for optimal performance
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '-',
        maxSize: 245760, // 240kb
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            // This regex ignores nested copies of framework libraries so they're bundled with their issuer.
            test: new RegExp(
              `(?<!node_modules.*)[\\\\/]node_modules[\\\\/](${FRAMEWORK_BUNDLES.join(
                `|`,
              )})[\\\\/]`,
            ),
            priority: 40,
            // Don't let webpack eliminate this chunk (prevents this chunk from becoming a part of the commons chunk)
            enforce: true,
          },
          commons: {
            name: 'commons',
            // if a chunk is used on all pages we put it in commons
            minChunks: TOTAL_PAGES,
            priority: 20,
          },
          lib: {
            // if a module is bigger than 160kb from node_modules we make a separate chunk for it
            test(module) {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier())
              );
            },
            name(module) {
              const rawRequest =
                module.rawRequest &&
                module.rawRequest.replace(/^@(\w+)[/\\]/, '$1-');
              if (rawRequest) return `${rawRequest}-lib`;

              const identifier = module.identifier();
              const trimmedIdentifier = /(?:^|[/\\])node_modules[/\\](.*)/.exec(
                identifier,
              );
              const processedIdentifier =
                trimmedIdentifier &&
                trimmedIdentifier[1].replace(/^@(\w+)[/\\]/, '$1-');

              return `${processedIdentifier || identifier}-lib`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          shared: {
            name(module, chunks) {
              const cryptoName = crypto
                .createHash('sha1')
                .update(
                  chunks.reduce((acc, chunk) => {
                    return acc + chunk.name;
                  }, ''),
                )
                .digest('base64')
                .replace(/\//g, '');

              return `shared-${cryptoName}`;
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 20,
      },
    },
    node: {
      // Override webpacks default handling for these as they arnt availible on the client.
      fs: 'empty',
      __filename: 'mock',
    },
    plugins: [
      // copy static files otherwise untouched by Webpack, e.g. favicon
      new CopyWebpackPlugin({
        patterns: [{ from: 'public' }],
      }),
      new DuplicatesPlugin({
        // Emit compilation warning or error? (Default: `false`)
        emitErrors: true,
        // Display full duplicates information? (Default: `false`)
        verbose: true,
      }),
      new webpack.DefinePlugin({
        'process.env': getClientEnvVars(DOT_ENV_CONFIG),
      }),
      /**
       * Needed to prevent bundle hashes changing when the order they're imported is changed.
       * See https://webpack.js.org/guides/caching/#module-identifiers
       */
      new webpack.HashedModuleIdsPlugin(),
      /*
       * This replaces calls to logger.node.js with logger.web.js, a client
       * side replacement, when building the bundle code for the client.
       * This avoids the weight of winston being included in the bundles and
       * issues arising from it trying to the use the file system
       */
      new webpack.NormalModuleReplacementPlugin(
        /(.*)logger.node(\.*)/,
        resource => {
          // eslint-disable-next-line no-param-reassign
          resource.request = resource.request.replace(
            /logger.node/,
            `logger.web`,
          );
        },
      ),
      /*
       * Exclude all moment locales so they can be included within service bundles
       */
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      // keep track of the generated chunks
      // this determines what scripts get put in the footer of the page
      new LoadablePlugin({
        filename: `loadable-stats-${APP_ENV}.json`,
        writeToDisk: true,
      }),
    ],
  };

  if (START_DEV_SERVER) {
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (IS_PROD) {
    const BrotliPlugin = require('brotli-webpack-plugin');
    const CompressionPlugin = require('compression-webpack-plugin');

    clientConfig.plugins.push(
      /**
       * Compresses Webpack assets with Brotli compression algorithm.
       * More advanced than gzip (compression-webpack-plugin).
       * https://github.com/mynameiswhm/brotli-webpack-plugin
       */
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      /**
       * Compresses Webpack assets with gzip Content-Encoding.
       * Prefer Brotli (using brotli-webpack-plugin) but we fall back to gzip.
       * https://github.com/webpack-contrib/compression-webpack-plugin
       */
      new CompressionPlugin({
        algorithm: 'gzip',
        filename: '[path].gz[query]',
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    );
  }
  if (IS_PROD) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line
    /**
     * Visualize size of webpack output files with an interactive zoomable treemap.
     * https://github.com/webpack-contrib/webpack-bundle-analyzer
     */
    clientConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        defaultSizes: 'gzip',
        generateStatsFile: true,
        openAnalyzer: false,
        reportFilename: '../../reports/webpackBundleReport.html',
        statsFilename: '../../reports/webpackBundleReport.json',
      }),
    );
  }
  return clientConfig;
};
