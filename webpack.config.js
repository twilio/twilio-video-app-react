const path = require('path');

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
  externals: {
    react: {          
        commonjs: "react",          
        commonjs2: "react",          
        amd: "React",          
        root: "React"      
    },      
    'react-dom': {          
        commonjs: "react-dom",          
        commonjs2: "react-dom",          
        amd: "ReactDOM",          
        root: "ReactDOM"      
    },
    'react-router-dom': 'react-router-dom',
    'react-scripts': 'react-scripts',
  },
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
