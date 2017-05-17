var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, Input, HostListener, ElementRef, forwardRef, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
var resolvedPromise = Promise.resolve(null);
/** TODO(custom special characters) */
/** TODO(custom patterns) */
/** TODO(cursor position) */
var MaskDirective = MaskDirective_1 = (function () {
    function MaskDirective(_elementRef, renderer) {
        this.renderer = renderer;
        this._maskSpecialCharacters = ['/', '(', ')', '.', ':', '-', ' ', '+'];
        this._maskAwaliablePatterns = {
            '0': /\d/,
            '9': /\d/,
            'A': /[a-zA-Z0-9]/,
            'S': /[a-zA-Z]/
        };
        this.OnChange = function (_) { };
        this._elementRef = _elementRef;
        this._modelWithSpecialCharacters = true;
    }
    MaskDirective.prototype.ngOnInit = function () {
        var _this = this;
        resolvedPromise.then(function () { return _this.applyValueChanges(); });
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
    Object.defineProperty(MaskDirective.prototype, "modelWithSpecialCharacters", {
        set: function (value) {
            this._modelWithSpecialCharacters = value;
        },
        enumerable: true,
        configurable: true
    });
    MaskDirective.prototype.onInput = function () {
        this.applyValueChanges();
    };
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
    MaskDirective.prototype._removeMask = function (value) {
        if (!value) {
            return value;
        }
        return value.replace(/(\/|\.|-)/gi, '');
    };
    MaskDirective.prototype._checkSymbolMask = function (inputSymbol, maskSymbol) {
        return inputSymbol === maskSymbol
            || this._maskAwaliablePatterns[maskSymbol] && this._maskAwaliablePatterns[maskSymbol].test(inputSymbol);
    };
    /** It applies the mask in the input and updates the control's value. */
    MaskDirective.prototype.applyValueChanges = function () {
        var val = this._elementRef.nativeElement.value;
        var maskedInput = this._applyMask(val, this._maskExpression);
        this._elementRef.nativeElement.value = maskedInput;
        if (this._modelWithSpecialCharacters === true) {
            this.OnChange(maskedInput);
        }
        else {
            this.OnChange(this._removeMask(val));
        }
    };
    /** It writes the value in the input */
    MaskDirective.prototype.writeValue = function (obj) {
        if (!obj) {
            return;
        }
        this._elementRef.nativeElement.value = this._applyMask(obj, this._maskExpression);
    };
    /** It updates the value when changes occurr */
    MaskDirective.prototype.registerOnChange = function (fn) {
        this.OnChange = fn;
        return;
    };
    /* TODO */
    MaskDirective.prototype.registerOnTouched = function (fn) { };
    /** It disables the input element */
    MaskDirective.prototype.setDisabledState = function (isDisabled) {
        if (isDisabled) {
            this.renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'true');
        }
        else {
            this.renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'false');
        }
    };
    return MaskDirective;
}());
__decorate([
    Input('mask'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], MaskDirective.prototype, "maskExpression", null);
__decorate([
    Input('specialCharacters'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], MaskDirective.prototype, "modelWithSpecialCharacters", null);
__decorate([
    HostListener('input'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MaskDirective.prototype, "onInput", null);
MaskDirective = MaskDirective_1 = __decorate([
    Directive({
        selector: '[mask]',
        providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(function () { return MaskDirective_1; }),
                multi: true
            }]
    }),
    __metadata("design:paramtypes", [ElementRef, Renderer2])
], MaskDirective);
export { MaskDirective };
var MaskDirective_1;
