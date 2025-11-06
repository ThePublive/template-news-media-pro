const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: {
    // CSS Bundles
    style_bundle: './assets/css/index.css',
    mobile_universal_bundle: './assets/css/mobile_universal.css',
    desktop_universal_bundle: './assets/css/universal.css',
    desktop_home_bundle: './assets/css/pages/desktop_home.css',
    media_query_bundle: './assets/css/media_query.css',

    // Component CSS
    header_css_bundle: './assets/css/components/header.css',
    footer_css_bundle: './assets/css/components/footer.css',
    sidemenu_css_bundle: './assets/css/components/sidemenu.css',

    // JS Bundles
    index_bundle: './assets/js/index.js',
    main_bundle: './assets/js/main.js',
    bookmark_bundle: './assets/js/bookmark.js',
    post_bundle: './assets/js/post.js',
    header_bundle: './assets/js/header.js',
    darkMode_bundle: './assets/js/darkMode.js',
    scrollToTop_bundle: './assets/js/scrollToTopBtn.js',
    widget_bundle: './assets/js/widget.js',
    customPage_bundle: './assets/js/customPage.js',
  },
  output: {
    path: path.resolve(__dirname, 'assets/bundles'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
