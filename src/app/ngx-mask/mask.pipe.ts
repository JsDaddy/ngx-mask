import { Pipe, PipeTransform } from '@angular/core';
import { MaskApplierService } from './mask-applier.service';

@Pipe({
  name: 'mask',
  pure: true
})
export class MaskPipe implements PipeTransform {

  public constructor(private _maskService: MaskApplierService) { }

  public transform(value: string|number, mask: string): string {
    if (!value) {
      return '';
    }
    return this._maskService.applyMask(`${value}`, mask);
  }
}
