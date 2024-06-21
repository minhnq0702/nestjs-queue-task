// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src/main.ts'),
  target: 'node',
  output: {
    filename: 'compiled.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      node_modules: path.join(__dirname, 'node_modules'),
      '@': path.resolve('src'),
    },
    extensions: ['.js', '.ts'],
  },
};
