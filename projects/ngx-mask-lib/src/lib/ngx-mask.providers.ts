import type { EnvironmentProviders, Provider } from '@angular/core';
import { inject, makeEnvironmentProviders } from '@angular/core';

import type { NgxMaskOptions } from './ngx-mask.config';
import { NGX_MASK_CONFIG, INITIAL_CONFIG, initialConfig, NEW_CONFIG } from './ngx-mask.config';
import { NgxMaskService } from './ngx-mask.service';

/**
 * @internal
 */
function _configFactory(): NgxMaskOptions {
    const initConfig = inject<NgxMaskOptions>(INITIAL_CONFIG);
    const configValue = inject<NgxMaskOptions | (() => NgxMaskOptions)>(NEW_CONFIG);

    return configValue instanceof Function
        ? { ...initConfig, ...configValue() }
        : { ...initConfig, ...configValue };
}

export function provideNgxMask(configValue?: NgxMaskOptions | (() => NgxMaskOptions)): Provider[] {
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
    configValue?: NgxMaskOptions | (() => NgxMaskOptions)
): EnvironmentProviders {
    return makeEnvironmentProviders(provideNgxMask(configValue));
}
