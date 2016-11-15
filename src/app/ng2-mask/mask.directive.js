"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var MaskDirective = (function () {
    function MaskDirective(_elementRef) {
        this._elementRef = _elementRef;
    }
    MaskDirective.prototype.onInput = function () {
        this._elementRef.nativeElement.value = this._applyMask(this._elementRef.nativeElement.value, this._maskExpression);
    };
    Object.defineProperty(MaskDirective.prototype, "maskExpression", {
        /* what shoul we do with immediately set property in parent component???*/
        // @Input()
        // public set ngModel(val) {
        //   console.log(val)
        //   if (!val) {
        //     return;
        //   }
        //   //this.ngModelChange.emit(this._applyMask(this._elementRef.nativeElement.value, this._maskExpression));
        // };
        /*try change this */
        // @Output()
        // public ngModelChange = new EventEmitter();
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
        for (var _i = 0, _a = inputValue.split(''); _i < _a.length; _i++) {
            var inputSymbol = _a[_i];
            if (result.length === maskExpression.length) {
                break;
            }
            while (['/', '(', ')', '.', ':', '-', ' ', '+'].includes(maskExpression[cursor])) {
                result += maskExpression[cursor];
                cursor++;
            }
            if (this._checkSymbolMask(inputSymbol, maskExpression[cursor])) {
                result += inputSymbol;
                cursor++;
            }
        }
        if (result.length + 1 === maskExpression.length
            && ['/', '(', ')', '.', ':', '-', ' ', '+'].includes(maskExpression[maskExpression.length - 1])) {
            result += maskExpression[maskExpression.length - 1];
        }
        return result;
    };
    MaskDirective.prototype._checkSymbolMask = function (input, letter) {
        return input === letter
            || letter === '0' && /\d/.test(input);
    };
    __decorate([
        core_1.HostListener('input')
    ], MaskDirective.prototype, "onInput", null);
    __decorate([
        core_1.Input('mask')
    ], MaskDirective.prototype, "maskExpression", null);
    MaskDirective = __decorate([
        core_1.Directive({
            selector: '[mask]'
        })
    ], MaskDirective);
    return MaskDirective;
}());
exports.MaskDirective = MaskDirective;
