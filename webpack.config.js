const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.tsx',
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
    "react-dom": {          
        commonjs: "react-dom",          
        commonjs2: "react-dom",          
        amd: "ReactDOM",          
        root: "ReactDOM"      
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: [/node_modules/, /build/],
        use: 'ts-loader',
      },
    ]
  },
}
