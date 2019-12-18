var path = require('path');
var npmPackage = require('./package.json');

module.exports = {
  // Change to your "entry-point".
  entry: './dist/index.js',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'ontouml.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      "@constants": `${__dirname}/src/constants`,
      "@error": `${__dirname}/src/error`,
      "@libs": `${__dirname}/src/libs`,
      "@rules": `${__dirname}/src/rules`,
      "@schemas": `${__dirname}/schemas`,
      "@utils": `${__dirname}/src/utils`
    }
  },
  module: {
    rules: [{
      // Include ts, tsx, js, and jsx files.
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  }
};
