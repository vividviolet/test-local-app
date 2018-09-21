const HtmlWebpackPlugin = require('html-webpack-plugin');
const { join, resolve } = require('path');
const shopifyExpress = require('@shopify/shopify-express');
const session = require('express-session');

//-----------------------------------------------------------------------------
// Base configuration
//-----------------------------------------------------------------------------

const config = {
  entry: {},
  devtool: 'source-map',
  plugins: [],
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            declaration: false,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
};

//-----------------------------------------------------------------------------
// Development configuration
//-----------------------------------------------------------------------------

const parts = [
  {
    name: 'app',
    entry: join(resolve(__dirname, './'), 'app/client/'),
    title: 'Fake Embedded Application',
    filename: 'app/index.html',
  },
];

function getOtherChunks(own) {
  return parts.map(part => part.name).filter(chunk => chunk !== own);
}

function getPart(part) {
  const { name, title, filename } = part;
  const partConfig = {
    chunks: [name],
    title,
    excludeChunks: getOtherChunks(name),
  };
  if (filename) {
    partConfig.filename = filename;
  }
  return new HtmlWebpackPlugin(partConfig);
}

const { routes } = shopifyExpress({
  host: 'https://app-bridge.myshopify.io',
  apiKey: 'app_bridge_key',
  secret: 'app_bridge_secret',
  scope: ['read_products'],
  afterAuth(request, response) {
    console.log('hi');
    const {
      session: { accessToken, shop },
    } = request;
    return response.redirect('/app');
  },
});

// Dev server
config.devServer = {
  disableHostCheck: true,
  inline: false,
  host: '0.0.0.0',
  hot: false,
  port: 39358,
  before(app) {
    app.use(session({ secret: 'foobarbaz' }));
    app.use('/', routes);
  },
};

parts.forEach(part => {
  // Entry
  config.entry[part.name] = part.entry;
  // Plugins
  config.plugins.push(getPart(part));
});

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------

module.exports = config;
