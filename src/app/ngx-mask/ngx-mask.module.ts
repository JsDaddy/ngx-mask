import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './mask.directive';

import { config, IConfig, initialConfig } from './config';

@NgModule({
  imports: [CommonModule],
  exports: [MaskDirective],
  declarations: [MaskDirective]
})
export class NgxMaskModule {

  public static forRoot(configValue: IConfig = initialConfig): ModuleWithProviders {
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
