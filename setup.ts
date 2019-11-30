require('module-alias/register');

const dotenv = require('dotenv');
dotenv.config();

// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require('@babel/register')({
  extensions: ['.ts'],
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: ['@babel/plugin-transform-runtime'],
});