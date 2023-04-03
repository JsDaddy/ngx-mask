import { inject, Pipe, PipeTransform } from '@angular/core';

import { IConfig } from './ngx-mask.config';
import { NgxMaskService } from './ngx-mask.service';

@Pipe({
    name: 'mask',
    pure: true,
    standalone: true,
})
export class NgxMaskPipe implements PipeTransform {
    private readonly defaultOptions: Partial<IConfig> = {};

    private readonly _maskService = inject(NgxMaskService);

    public transform(
        value: string | number,
        mask: string,
        { patterns, ...config }: Partial<IConfig> = {} as Partial<IConfig>
    ): string {
        const currentConfig = {
            maskExpression: mask,
            ...this.defaultOptions,
            ...config,
            patterns: {
                ...this._maskService.patterns,
                ...patterns,
            },
        };
        Object.entries(currentConfig).forEach(([key, value]) => {
            //eslint-disable-next-line  @typescript-eslint/no-explicit-any
            (this._maskService as any)[key] = value;
        });
        return this._maskService.applyMask(`${value}`, mask);
    }
}
