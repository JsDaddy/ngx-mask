import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './mask.directive';

import { _config, config, initialConfig, optionsConfig } from './config';

@NgModule({
  imports: [CommonModule],
  exports: [MaskDirective],
  declarations: [MaskDirective]
})
export class NgxMaskModule {

  public static forRoot(configValue: optionsConfig = initialConfig): ModuleWithProviders {
    return {
      ngModule: NgxMaskModule,
      providers: [
        { provide: config, useFactory: _configFactory, deps: [_config] },
        { provide: _config, useValue: { ...initialConfig, ...configValue } }
      ]
    };
  }


}

/**
 * @internal
 */
export function _configFactory(configValue: optionsConfig | (() => optionsConfig)): Function | optionsConfig {
  return (typeof configValue === 'function') ? configValue() : configValue;
}
