import type { PipeTransform } from '@angular/core';
import { inject, Pipe } from '@angular/core';

import type { NgxMaskConfig } from './ngx-mask.config';
import { NGX_MASK_CONFIG, resolveMaskAlias } from './ngx-mask.config';
import { NgxMaskService } from './ngx-mask.service';
import { MaskExpression } from './ngx-mask-expression.enum';

@Pipe({
    name: 'mask',
    pure: true,
    standalone: true,
})
export class NgxMaskPipe implements PipeTransform {
    private readonly defaultOptions = inject<NgxMaskConfig>(NGX_MASK_CONFIG);

    private readonly _maskService = inject(NgxMaskService);

    private _maskExpressionArray: string[] = [];

    private mask = '';

    public transform(
        value: string | number,
        mask: string,
        { patterns, maskAliases, ...config }: Partial<NgxMaskConfig> = {} as Partial<NgxMaskConfig>
    ): string {
        let processedValue: string | number = value;

        // User-defined aliases expand BEFORE any other mask processing (incl. `||` handling).
        const resolvedMask = resolveMaskAlias(mask, {
            ...this.defaultOptions.maskAliases,
            ...maskAliases,
        });

        const currentConfig = {
            maskExpression: resolvedMask,
            ...this.defaultOptions,
            ...config,
            patterns: {
                ...this._maskService.patterns,
                ...patterns,
            },
        };

        Object.entries(currentConfig).forEach(([key, val]) => {
            (this._maskService as any)[key] = val;
        });

        if (resolvedMask.includes('||')) {
            const maskParts = resolvedMask.split('||');
            if (maskParts.length > 1) {
                this._maskExpressionArray = maskParts.sort(
                    (a: string, b: string) => a.length - b.length
                );
                this._setMask(`${processedValue}`);
                return this._maskService.applyMask(`${processedValue}`, this.mask);
            } else {
                this._maskExpressionArray = [];
                return this._maskService.applyMask(`${processedValue}`, this.mask);
            }
        }

        if (resolvedMask.includes(MaskExpression.CURLY_BRACKETS_LEFT)) {
            return this._maskService.applyMask(
                `${processedValue}`,
                this._maskService._repeatPatternSymbols(resolvedMask)
            );
        }

        if (resolvedMask.startsWith(MaskExpression.SEPARATOR)) {
            if (config.decimalMarker) {
                this._maskService.decimalMarker = config.decimalMarker;
            }
            if (config.thousandSeparator) {
                this._maskService.thousandSeparator = config.thousandSeparator;
            }
            if (config.leadZero) {
                this._maskService.leadZero = config.leadZero;
            }

            processedValue = String(processedValue);
            const localeDecimalMarker = this._maskService.currentLocaleDecimalMarker();

            if (!Array.isArray(this._maskService.decimalMarker)) {
                processedValue =
                    this._maskService.decimalMarker !== localeDecimalMarker
                        ? (processedValue as string).replace(
                              localeDecimalMarker,
                              this._maskService.decimalMarker
                          )
                        : processedValue;
            }

            if (
                this._maskService.leadZero &&
                processedValue &&
                this._maskService.dropSpecialCharacters !== false
            ) {
                processedValue = this._maskService._checkPrecision(
                    resolvedMask,
                    processedValue as string
                );
            }

            if (this._maskService.decimalMarker === MaskExpression.COMMA) {
                processedValue = (processedValue as string).replace(
                    MaskExpression.DOT,
                    MaskExpression.COMMA
                );
            }

            this._maskService.isNumberValue = true;
        }

        if (processedValue === null || typeof processedValue === 'undefined') {
            return this._maskService.applyMask('', resolvedMask);
        }

        return this._maskService.applyMask(`${processedValue}`, resolvedMask);
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
                    this.mask =
                        this._maskExpressionArray[this._maskExpressionArray.length - 1] ??
                        MaskExpression.EMPTY_STRING;
                }
            });
        }
    }
}
