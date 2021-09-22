import * as webpackConfig from './webpack.config';
import { ResolvedDevServerConfig, startDevServer } from '@cypress/webpack-dev-server';

module.exports = (
  on: (arg0: string, arg1: (options: any) => Promise<ResolvedDevServerConfig>) => void,
  config: any
) => {
  on('dev-server:start', (options) =>
    startDevServer({
      options,
      webpackConfig,
    })
  );
  return config;
};
