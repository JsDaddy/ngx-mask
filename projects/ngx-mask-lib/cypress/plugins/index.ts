import { startAngularDevServer } from '@jscutlery/cypress-angular';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = (on: any, config: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on('dev-server:start', (options: any) =>
        startAngularDevServer({
            options,
            tsConfig: 'tsconfig.cypress.json',
        })
    );
    return config;
};
