const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['./index.tsx'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'twilio-video-app-react.js',
    library: 'twilio-video-app-react',      
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),      
    } 
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ]
  },
}
