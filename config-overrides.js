const { override, addWebpackResolve } = require('customize-cra');
const TsPathAliases = require('tsconfig-paths-webpack-plugin')

module.exports = override(
  addWebpackResolve({
    plugins: [
      new TsPathAliases()
    ]
  })
);
