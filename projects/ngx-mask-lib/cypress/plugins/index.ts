import { ResolvedDevServerConfig } from '@cypress/webpack-dev-server';
import { startAngularDevServer } from '@jscutlery/cypress-angular-dev-server';

module.exports = (
  on: (arg0: string, arg1: (options: any) => Promise<ResolvedDevServerConfig>) => void,
  config: any
) => {
  on('dev-server:start', (options) => startAngularDevServer({ options, tsConfig: 'tsconfig.cypress.json' }));
  return config;
};
