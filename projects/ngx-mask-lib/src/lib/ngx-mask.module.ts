import { ModuleWithProviders, NgModule } from '@angular/core';

import { config, INITIAL_CONFIG, initialConfig, NEW_CONFIG, optionsConfig } from './config';
import { MaskApplierService } from './mask-applier.service';
import { MaskDirective } from './mask.directive';
import { MaskPipe } from './mask.pipe';
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
    exports: [MaskDirective, MaskPipe],
    declarations: [MaskDirective, MaskPipe],
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
                    provide: config,
                    useFactory: _configFactory,
                    deps: [INITIAL_CONFIG, NEW_CONFIG],
                },
                MaskApplierService,
            ],
        };
    }

    public static forChild(): ModuleWithProviders<NgxMaskModule> {
        return {
            ngModule: NgxMaskModule,
        };
    }
}
