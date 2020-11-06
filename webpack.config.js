const path = require('path');

module.exports = {
  entry: {
    'twilio-video-app-react': './src/module.ts',
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'twilio-video-app-react',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom'),
    },
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
