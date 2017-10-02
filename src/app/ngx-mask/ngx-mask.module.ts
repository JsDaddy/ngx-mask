import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './mask.directive';

import { config, initialConfig, optionsConfig } from './config';

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
        {
          provide: config,
          useValue: { ...initialConfig, ...configValue }
        }
      ]
    };
  }


}
