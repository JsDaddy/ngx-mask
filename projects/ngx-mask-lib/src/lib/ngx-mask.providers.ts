import { EnvironmentProviders, inject, makeEnvironmentProviders, Provider } from '@angular/core';

import {
    NGX_MASK_CONFIG,
    INITIAL_CONFIG,
    initialConfig,
    NEW_CONFIG,
    optionsConfig,
} from './ngx-mask.config';
import { NgxMaskService } from './ngx-mask.service';

/**
 * @internal
 */
function _configFactory(): optionsConfig {
    const initConfig = inject<optionsConfig>(INITIAL_CONFIG);
    const configValue = inject<optionsConfig | (() => optionsConfig)>(NEW_CONFIG);

    return configValue instanceof Function
        ? { ...initConfig, ...configValue() }
        : { ...initConfig, ...configValue };
}

export function provideNgxMask(configValue?: optionsConfig | (() => optionsConfig)): Provider[] {
    return [
        {
            provide: NEW_CONFIG,
            useValue: configValue,
        },
        {
            provide: INITIAL_CONFIG,
            useValue: initialConfig,
        },
        {
            provide: NGX_MASK_CONFIG,
            useFactory: _configFactory,
        },
        NgxMaskService,
    ];
}

export function provideEnvironmentNgxMask(
    configValue?: optionsConfig | (() => optionsConfig)
): EnvironmentProviders {
    return makeEnvironmentProviders(provideNgxMask(configValue));
}
