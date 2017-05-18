import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
var resolvedPromise = Promise.resolve(null);
var MaskDirective = (function () {
    function MaskDirective(_elementRef, renderer) {
        this._elementRef = _elementRef;
        this.renderer = renderer;
        this._maskSpecialCharacters = ['/', '(', ')', '.', ':', '-', ' ', '+'];
        this._maskAwaliablePatterns = {
            '0': /\d/,
            '9': /\d/,
            'A': /[a-zA-Z0-9]/,
            'S': /[a-zA-Z]/
        };
    }
    Object.defineProperty(MaskDirective.prototype, "maskExpression", {
        set: function (value) {
            if (!value) {
                return;
            }
            this._maskExpression = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaskDirective.prototype, "modelWithSpecialCharacters", {
        set: function (value) {
            this._modelWithSpecialCharacters = value;
        },
        enumerable: true,
        configurable: true
    });
    MaskDirective.prototype.onInput = function () {
        var maskedInput = this._applyMask(this._elementRef.nativeElement.value, this._maskExpression);
        this._elementRef.nativeElement.value = maskedInput;
        if (this._modelWithSpecialCharacters === true) {
            return this.OnChange(maskedInput);
        }
        this.OnChange(this._removeMask(this._elementRef.nativeElement.value));
    };
    MaskDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._modelWithSpecialCharacters = true;
        resolvedPromise.then(function () {
            if (_this._modelWithSpecialCharacters === true) {
                return _this.OnChange(_this._applyMask(_this._elementRef.nativeElement.value, _this._maskExpression));
            }
            _this.OnChange(_this._removeMask(_this._elementRef.nativeElement.value));
        });
    };
    /** CONTROL VALUE ACESSOR IMPLEMENTATION */
    MaskDirective.prototype.writeValue = function (obj) {
        if (!obj) {
            return;
        }
        this._elementRef.nativeElement.value = this._applyMask(obj, this._maskExpression);
    };
    // tslint:disable-next-line
    MaskDirective.prototype.registerOnChange = function (fn) {
        this.OnChange = fn;
        return;
    };
    // tslint:disable-next-line
    MaskDirective.prototype.registerOnTouched = function (fn) { };
    MaskDirective.prototype.setDisabledState = function (isDisabled) {
        if (isDisabled) {
            return this.renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'true');
        }
        this.renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'false');
    };
    // tslint:disable-next-line
    MaskDirective.prototype.OnChange = function (_) { };
    MaskDirective.prototype._applyMask = function (inputValue, maskExpression) {
        var cursor = 0;
        var result = '';
        var inputArray = inputValue.split('');
        // tslint:disable-next-line
        for (var i = 0, inputSymbol = inputArray[0]; i
            < inputArray.length; i++, inputSymbol = inputArray[i]) {
            if (result.length === maskExpression.length) {
                break;
            }
            if (this._checkSymbolMask(inputSymbol, maskExpression[cursor])) {
                result += inputSymbol;
                cursor++;
            }
            else if (this._maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
                result += maskExpression[cursor];
                cursor++;
                i--;
            }
            else if (maskExpression[cursor] === '9') {
                cursor++;
                i--;
            }
        }
        if (result.length + 1 === maskExpression.length
            && this._maskSpecialCharacters.indexOf(maskExpression[maskExpression.length - 1]) !== -1) {
            result += maskExpression[maskExpression.length - 1];
        }
        return result;
    };
    MaskDirective.prototype._removeMask = function (value) {
        if (!value) {
            return value;
        }
        return value.replace(/(\/|\.|-)/gi, '');
    };
    MaskDirective.prototype._checkSymbolMask = function (inputSymbol, maskSymbol) {
        return inputSymbol === maskSymbol
            || this._maskAwaliablePatterns[maskSymbol]
                && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol);
    };
    MaskDirective.prototype.isValidValue = function () {
        /**
         * TODO(verificar se o valor é válido ou não)
         * */
    };
    return MaskDirective;
}());
export { MaskDirective };
MaskDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mask]',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(function () { return MaskDirective; }),
                        multi: true
                    }
                ]
            },] },
];
/** @nocollapse */
MaskDirective.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer2, },
]; };
MaskDirective.propDecorators = {
    'maskExpression': [{ type: Input, args: ['mask',] },],
    'modelWithSpecialCharacters': [{ type: Input, args: ['specialCharacters',] },],
    'onInput': [{ type: HostListener, args: ['input',] },],
};
