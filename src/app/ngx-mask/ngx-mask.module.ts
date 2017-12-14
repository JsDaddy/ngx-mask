import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './mask.directive';

import { NEW_CONFIG, INITIAL_CONFIG, config, initialConfig, optionsConfig } from './config';

@NgModule({
  imports: [CommonModule],
  exports: [MaskDirective],
  declarations: [MaskDirective]
})
export class NgxMaskModule {

  public static forRoot(configValue?: optionsConfig): ModuleWithProviders {
    return {
      ngModule: NgxMaskModule,
      providers: [
        { provide: NEW_CONFIG, useValue: configValue },
        { provide: INITIAL_CONFIG, useValue: initialConfig },
        { provide: config, useFactory: _configFactory, deps: [INITIAL_CONFIG, NEW_CONFIG] },
      ]
    };
  }
}

/**
 * @internal
 */
export function _configFactory(initConfig: optionsConfig, configValue: optionsConfig | (() => optionsConfig)): Function | optionsConfig {
  return (typeof configValue === 'function') ? configValue() : { ...initConfig, ...configValue };
}
