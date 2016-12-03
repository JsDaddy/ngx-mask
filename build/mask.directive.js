import { Directive, Input, Output, HostListener, ElementRef, EventEmitter } from '@angular/core';
var resolvedPromise = Promise.resolve(null);
export var MaskDirective = (function () {
    function MaskDirective(_elementRef) {
        this.ngModelChange = new EventEmitter();
        this._maskSpecialCharacters = ['/', '(', ')', '.', ':', '-', ' ', '+'];
        this._maskAwaliablePatterns = {
            '0': /\d/,
            '9': /\d/,
            'A': /[a-zA-Z0-9]/,
            'S': /[a-zA-Z]/
        };
        this._elementRef = _elementRef;
    }
    MaskDirective.prototype.onInput = function () {
        this._elementRef.nativeElement.value = this._applyMask(this._elementRef.nativeElement.value, this._maskExpression);
        this.ngModelChange.emit(this._applyMask(this._elementRef.nativeElement.value, this._maskExpression));
    };
    MaskDirective.prototype.ngOnInit = function () {
        var _this = this;
        resolvedPromise.then(function () {
            return _this.ngModelChange.emit(_this._applyMask(_this._elementRef.nativeElement.value, _this._maskExpression));
        });
    };
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
    MaskDirective.prototype._applyMask = function (inputValue, maskExpression) {
        var cursor = 0;
        var result = '';
        var inputArray = inputValue.split('');
        for (var i = 0, inputSymbol = inputArray[0]; i < inputArray.length; i++, inputSymbol = inputArray[i]) {
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
    MaskDirective.prototype._checkSymbolMask = function (inputSymbol, maskSymbol) {
        return inputSymbol === maskSymbol
            || this._maskAwaliablePatterns[maskSymbol] && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol);
    };
    MaskDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mask]'
                },] },
    ];
    /** @nocollapse */
    MaskDirective.ctorParameters = [
        { type: ElementRef, },
    ];
    MaskDirective.propDecorators = {
        'onInput': [{ type: HostListener, args: ['input',] },],
        'maskExpression': [{ type: Input, args: ['mask',] },],
        'ngModelChange': [{ type: Output },],
    };
    return MaskDirective;
}());
//# sourceMappingURL=/Users/stevermeister/workspace/ng2-mask/src/app/ng2-mask/mask.directive.js.map