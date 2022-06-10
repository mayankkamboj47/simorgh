const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  webpackDirAlias: {
    '#app': resolvePath('src/app'),
    '#contexts': resolvePath('src/app/contexts'),
    '#components': resolvePath('src/app/components'),
    '#containers': resolvePath('src/app/containers'),
    '#data': resolvePath('data/'),
    '#hooks': resolvePath('src/app/hooks'),
    '#legacy': resolvePath('src/app/legacy'),
    '#lib': resolvePath('src/app/lib/'),
    '#models': resolvePath('src/app/models/'),
    '#pages': resolvePath('src/app/pages/'),
    '#testHelpers': resolvePath('src/testHelpers/'),
    '#types': resolvePath('src/app/types'),
    '#server': resolvePath('src/server/'),
    '#utils': resolvePath('src/app/routes/utils/'),
  },
  jestDirAlias: {
    '^#app(.*)$': '<rootDir>/src/app$1',
    '^#contexts(.*)$': '<rootDir>/src/app/contexts$1',
    '^#components(.*)$': '<rootDir>/src/app/components$1',
    '^#containers(.*)$': '<rootDir>/src/app/containers$1',
    '^#data(.*)$': '<rootDir>/data$1',
    '^#hooks(.*)$': '<rootDir>/src/app/hooks$1',
    '^#legacy(.*)$': '<rootDir>/src/app/legacy$1',
    '^#lib(.*)$': '<rootDir>/src/app/lib$1',
    '^#models(.*)$': '<rootDir>/src/app/models$1',
    '^#pages(.*)$': '<rootDir>/src/app/pages$1',
    '^#testHelpers(.*)$': '<rootDir>/src/testHelpers$1',
    '^#types(.*)$': '<rootDir>/src/app/types$1',
    '^#server(.*)$': '<rootDir>/src/server$1',
    '^#utils(.*)$': '<rootDir>/src/app/routes/utils$1',
  },
  eslintDirAlias: {
    map: [
      ['#app', './src/app'],
      ['#contexts', './src/app/contexts'],
      ['#components', './src/app/components'],
      ['#containers', './src/app/containers'],
      ['#data', './data'],
      ['#hooks', './src/app/hooks'],
      ['#lib', './src/app/lib'],
      ['#legacy', './src/app/legacy'],
      ['#models', './src/app/models'],
      ['#pages', './src/app/pages'],
      ['#testHelpers', './src/testHelpers'],
      ['#types', './src/app/types'],
      ['#server', './src/server'],
      ['#utils', './src/app/routes/utils'],
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};
