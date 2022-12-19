import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { CONFIG, INITIAL_CONFIG, initialConfig, NEW_CONFIG, optionsConfig } from './config';
import { NgxMaskApplierService } from './ngx-mask-applier.service';

/**
 * @internal
 */
function _configFactory(
    initConfig: optionsConfig,
    configValue: optionsConfig | (() => optionsConfig)
): optionsConfig {
    return configValue instanceof Function
        ? { ...initConfig, ...configValue() }
        : { ...initConfig, ...configValue };
}

export function provideNgxMask(
    configValue?: optionsConfig | (() => optionsConfig)
): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: NEW_CONFIG,
            useValue: configValue,
        },
        {
            provide: INITIAL_CONFIG,
            useValue: initialConfig,
        },
        {
            provide: CONFIG,
            useFactory: _configFactory,
            deps: [INITIAL_CONFIG, NEW_CONFIG],
        },
        NgxMaskApplierService,
    ]);
}
