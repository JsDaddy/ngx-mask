import { startAngularDevServer } from '@jscutlery/cypress-angular';

// @ts-ignore
module.exports = (on, config) => {
	on('dev-server:start', (options: any) =>
		startAngularDevServer({ options, tsConfig: 'tsconfig.cypress.json' }),
	);
	return config;
};
