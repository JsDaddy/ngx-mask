import { ModuleWithProviders, NgModule } from '@angular/core';

import { config, INITIAL_CONFIG, initialConfig, NEW_CONFIG, optionsConfig } from './config';
import { MaskApplierService } from './mask-applier.service';
import { MaskDirective } from './mask.directive';
import { MaskPipe } from './mask.pipe';

@NgModule({
  providers: [MaskApplierService],
  exports: [MaskDirective, MaskPipe],
  declarations: [MaskDirective, MaskPipe]
})
export class NgxMaskModule {

  public static forRoot(configValue?: optionsConfig): ModuleWithProviders {
    return {
      ngModule: NgxMaskModule,
      providers: [
        {
          provide: NEW_CONFIG,
          useValue: configValue
        },
        {
          provide: INITIAL_CONFIG,
          useValue: initialConfig
        },
        {
          provide: config,
          useFactory: _configFactory,
          deps: [INITIAL_CONFIG, NEW_CONFIG]
        },
      ]
    };
  }
  public static forChild(configValue?: optionsConfig): ModuleWithProviders {
    return {
      ngModule: NgxMaskModule,
    };
  }
}

/**
 * @internal
 */
export function _configFactory
(initConfig: optionsConfig, configValue: optionsConfig | (() => optionsConfig)): Function | optionsConfig {
  return (typeof configValue === 'function') ? configValue() : { ...initConfig, ...configValue };
}
