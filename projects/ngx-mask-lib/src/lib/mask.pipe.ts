import { Pipe, PipeTransform } from '@angular/core';

import { MaskApplierService } from './mask-applier.service';
import { IConfig } from './config';

@Pipe({
  name: 'mask',
  pure: true,
})
export class MaskPipe implements PipeTransform {
  public constructor(private _maskService: MaskApplierService) {}

  public transform(
    value: string | number,
    mask: string | [string, IConfig['patterns']],
    thousandSeparator: string | null = null
  ): string {
    if (!value && typeof value !== 'number') {
      return '';
    }
    if (thousandSeparator) {
      this._maskService.thousandSeparator = thousandSeparator;
    }
    if (typeof mask === 'string') {
      return this._maskService.applyMask(`${value}`, mask);
    }
    return this._maskService.applyMaskWithPattern(`${value}`, mask);
  }
}
