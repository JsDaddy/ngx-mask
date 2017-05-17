import { OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
/** TODO(custom special characters) */
/** TODO(custom patterns) */
/** TODO(cursor position) */
export declare class MaskDirective implements OnInit, ControlValueAccessor {
    private renderer;
    private _modelWithSpecialCharacters;
    private _maskExpression;
    private _elementRef;
    private _maskSpecialCharacters;
    private _maskAwaliablePatterns;
    constructor(_elementRef: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
    maskExpression: string;
    modelWithSpecialCharacters: boolean;
    onInput(): void;
    private OnChange;
    private _applyMask(inputValue, maskExpression);
    private _removeMask(value);
    private _checkSymbolMask(inputSymbol, maskSymbol);
    /** It applies the mask in the input and updates the control's value. */
    private applyValueChanges();
    /** It writes the value in the input */
    writeValue(obj: any): void;
    /** It updates the value when changes occurr */
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    /** It disables the input element */
    setDisabledState(isDisabled: boolean): void;
}
