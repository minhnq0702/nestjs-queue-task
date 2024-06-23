// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  entry: {
    app: path.join(__dirname, 'src/main.ts'),
    'tasks.processor': './src/shared/tasks/tasks.processor.ts',
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      node_modules: path.join(__dirname, 'node_modules'),
      '@': path.resolve('src'),
    },
    extensions: ['.js', '.ts'],
  },
};
