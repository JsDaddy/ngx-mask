import { Injectable } from "@angular/core";
import { MaskExpression } from "./ngx-mask-expression.enum";
import { NgxMaskService } from "./ngx-mask.service";

@Injectable()
export class NgxMaskFaultDetectionService {

    constructor(private _maskService: NgxMaskService){ }

    /**
     * Attempts to remove the mask from the maskedValue and compare it with inputValue. Accounts for irreversible changes, such as loss of precision or dropped special characters.
     * @param maskedValue the input value after being masked (doesn't call applyMask() itself because doing so causes undesired side effects).
     * @param inputValue the value that would be sent to the native element.
     * @returns whether the mask can be removed without any unexpected loss of characters.
     */
    public maskApplicationFault(maskedValue: string, inputValue: string): boolean {
        const unmaskedValue = this._maskService.removeMask(maskedValue);
        if (this._maskService.dropSpecialCharacters) {
            inputValue = this.removeSpecialCharactersFrom(inputValue);
        }

        if (this._maskService.hiddenInput) {
            inputValue = this.removeHiddenCharacters(unmaskedValue, inputValue);
        }
        
        if (unmaskedValue === inputValue) {
            return false;
        }

        // They may still not match due to lost precision 
        const hasPrecision = this._maskService.maskExpression.indexOf(MaskExpression.SEPARATOR + ".");
        const mayPossiblyLosePrecision = hasPrecision >= 0;
        if (mayPossiblyLosePrecision) {
            const maskExpressionPrecision = Number(this._maskService.maskExpression.split(MaskExpression.SEPARATOR + ".")[1]);
            const decimalMarkers = Array.isArray(this._maskService.decimalMarker) ? this._maskService.decimalMarker : [ this._maskService.decimalMarker ];
            const unmaskedPrecisionLossDueToMask = decimalMarkers.some((dm) => {
                const split = unmaskedValue.split(dm);
                const unmaskedValuePrecision = split[split.length - 1]?.length;
                const unmaskedPrecisionLossDueToMask = unmaskedValuePrecision === maskExpressionPrecision;
                return unmaskedPrecisionLossDueToMask;
            });
            if (unmaskedPrecisionLossDueToMask) {
                return false;
            }

            const scientificNotation = inputValue.indexOf("e") > 0;
            if (scientificNotation) {
                const power = inputValue.split("e")[1];
                if (power && unmaskedValue.endsWith(power)) {
                    return false;
                }
            }
        }

        // removeMask() might not be removing the thousandth separator
        const unmaskedWithoutThousandth = this.replaceEachCharacterWith(unmaskedValue, this._maskService.thousandSeparator, MaskExpression.EMPTY_STRING);
        if (unmaskedWithoutThousandth === inputValue) {
            return false;
        }
        
        // Is there any other reason to ignore a diff between unmaskedValue and inputValue?
        console.warn(`Unexpected fault applying mask: ${this._maskService.maskExpression} to value: ${inputValue}`);
        return true;
    }

    private removeSpecialCharactersFrom(inputValue: string): string {
        const specialCharacters = Array.isArray(this._maskService.dropSpecialCharacters)
            ? this._maskService.dropSpecialCharacters.concat(this._maskService.specialCharacters)
            : this._maskService.specialCharacters;
        let result = inputValue;
        specialCharacters.forEach(sc => {
            result = this.replaceEachCharacterWith(result, sc, MaskExpression.EMPTY_STRING);
        });

        return result;
    }

    private removeHiddenCharacters(unmaskedValue: string, inputValue: string): string {
        for (let i = 0; i < unmaskedValue.length; i++) {
            const charAt = unmaskedValue.charAt(i);
            const isHidden = charAt === MaskExpression.SYMBOL_STAR;
            if (isHidden) {
                const part_1 = inputValue.substring(0, i);
                const part_2 = MaskExpression.SYMBOL_STAR;
                const part_3 = inputValue.substring(i + 1)
                inputValue = `${part_1}${part_2}${part_3}`
            }
        }

        return inputValue;
    }

    private replaceEachCharacterWith(result: string, replace: string, replaceWith: string): string {
        while (result.indexOf(replace) >= 0) {
            result = result.replace(replace, replaceWith);
        }

        return result;
    }
}