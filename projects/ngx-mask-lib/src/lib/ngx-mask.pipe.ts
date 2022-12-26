import { Pipe, PipeTransform } from '@angular/core';

import { NgxMaskApplierService } from './ngx-mask-applier.service';
import { IConfig } from './ngx-mask.config';

@Pipe({
    name: 'mask',
    pure: true,
    standalone: true,
})
export class NgxMaskPipe implements PipeTransform {
    //TODO(inepipepnko): need use inject fn but problem with error in test
    public constructor(private readonly _maskService: NgxMaskApplierService) {}

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
