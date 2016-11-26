import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './src/app/ng2-mask/mask.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[MaskDirective],
  declarations: [MaskDirective]
})
export class Ng2MaskModule { }