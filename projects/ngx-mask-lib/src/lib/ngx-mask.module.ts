import { ModuleWithProviders, NgModule } from '@angular/core';

import {
    NGX_MASK_CONFIG,
    INITIAL_CONFIG,
    initialConfig,
    NEW_CONFIG,
    optionsConfig,
} from './ngx-mask.config';
import { NgxMaskDirective } from './ngx-mask.directive';
import { NgxMaskPipe } from './ngx-mask.pipe';
import { NgxMaskService } from './ngx-mask.service';

/**
 * @internal
 */
export function _configFactory(
    initConfig: optionsConfig,
    configValue: optionsConfig | (() => optionsConfig)
): optionsConfig {
    return configValue instanceof Function
        ? { ...initConfig, ...configValue() }
        : { ...initConfig, ...configValue };
}

@NgModule({
    exports: [NgxMaskDirective, NgxMaskPipe],
    declarations: [NgxMaskDirective, NgxMaskPipe],
})
export class NgxMaskModule {
    public static forRoot(
        configValue?: optionsConfig | (() => optionsConfig)
    ): ModuleWithProviders<NgxMaskModule> {
        return {
            ngModule: NgxMaskModule,
            providers: [
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
                    deps: [INITIAL_CONFIG, NEW_CONFIG],
                },
                NgxMaskService,
            ],
        };
    }

    public static forChild(): ModuleWithProviders<NgxMaskModule> {
        return {
            ngModule: NgxMaskModule,
        };
    }
}
