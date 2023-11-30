import { Pipe, PipeTransform } from '@angular/core';

import { IConfig } from './ngx-mask.config';
import { NgxMaskService } from './ngx-mask.service';
import { MaskExpression } from './ngx-mask-expression.enum';

@Pipe({
    name: 'mask',
    pure: true,
})
export class NgxMaskPipe implements PipeTransform {
    public constructor(private _maskService: NgxMaskService) {}

    private readonly defaultOptions: Partial<IConfig> = {};

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
        if (mask.startsWith(MaskExpression.SEPARATOR)) {
            if (config.decimalMarker) {
                this._maskService.decimalMarker = config.decimalMarker;
            }
            if (config.thousandSeparator) {
                this._maskService.thousandSeparator = config.thousandSeparator;
            }
            if (config.leadZero) {
                // eslint-disable-next-line no-param-reassign
                this._maskService.leadZero = config.leadZero;
            }
            // eslint-disable-next-line no-param-reassign
            value = String(value);
            const localeDecimalMarker = this._maskService.currentLocaleDecimalMarker();
            if (!Array.isArray(this._maskService.decimalMarker)) {
                // eslint-disable-next-line no-param-reassign
                value =
                    this._maskService.decimalMarker !== localeDecimalMarker
                        ? value.replace(localeDecimalMarker, this._maskService.decimalMarker)
                        : value;
            }
            if (
                this._maskService.leadZero &&
                value &&
                this._maskService.dropSpecialCharacters !== false
            ) {
                // eslint-disable-next-line no-param-reassign
                value = this._maskService._checkPrecision(mask, value as string);
            }
            if (this._maskService.decimalMarker === MaskExpression.COMMA) {
                // eslint-disable-next-line no-param-reassign
                value = value.toString().replace(MaskExpression.DOT, MaskExpression.COMMA);
            }
            this._maskService.isNumberValue = true;
        }
        if (value === null || value === undefined) {
            return this._maskService.applyMask('', mask);
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
