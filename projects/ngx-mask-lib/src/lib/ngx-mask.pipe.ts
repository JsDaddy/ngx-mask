import { inject, Pipe, PipeTransform } from '@angular/core';

import { IConfig } from './ngx-mask.config';
import { NgxMaskService } from './ngx-mask.service';
import { MaskExpression } from './ngx-mask-expression.enum';

@Pipe({
    name: 'mask',
    pure: true,
    standalone: true,
})
export class NgxMaskPipe implements PipeTransform {
    private readonly defaultOptions: Partial<IConfig> = {};

    private readonly _maskService = inject(NgxMaskService);

    private _maskExpressionArray: string[] = [];

    private mask = '';

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
        if (mask.includes('||')) {
            if (mask.split('||').length > 1) {
                this._maskExpressionArray = mask.split('||').sort((a: string, b: string) => {
                    return a.length - b.length;
                });
                this._setMask(value as string);
                return this._maskService.applyMask(`${value}`, this.mask);
            } else {
                this._maskExpressionArray = [];
                return this._maskService.applyMask(`${value}`, this.mask);
            }
        }
        if (mask.includes(MaskExpression.CURLY_BRACKETS_LEFT)) {
            return this._maskService.applyMask(
                `${value}`,
                this._maskService._repeatPatternSymbols(mask)
            );
        }
        return this._maskService.applyMask(`${value}`, mask);
    }

    private _setMask(value: string) {
        if (this._maskExpressionArray.length > 0) {
            this._maskExpressionArray.some((mask): boolean | void => {
                const test =
                    this._maskService.removeMask(value)?.length <=
                    this._maskService.removeMask(mask)?.length;
                if (value && test) {
                    this.mask = mask;
                    return test;
                } else {
                    const expression =
                        this._maskExpressionArray[this._maskExpressionArray.length - 1] ??
                        MaskExpression.EMPTY_STRING;
                    this.mask = expression;
                }
            });
        }
    }
}
