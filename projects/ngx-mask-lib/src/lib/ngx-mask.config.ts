import { EventEmitter, InjectionToken } from '@angular/core';
import { MaskExpression } from './ngx-mask-expression.enum';

export type InputTransformFn = (value: unknown) => string | number;

export type OutputTransformFn = (value: string | number | undefined | null) => unknown;

export type NgxMaskConfig = {
    suffix: string;
    prefix: string;
    thousandSeparator: string;
    decimalMarker: '.' | ',' | ['.', ','];
    clearIfNotMatch: boolean;
    showMaskTyped: boolean;
    placeHolderCharacter: string;
    shownMaskExpression: string;
    specialCharacters: string[] | readonly string[];
    dropSpecialCharacters: boolean | string[] | readonly string[];
    hiddenInput: boolean;
    validation: boolean;
    instantPrefix: boolean;
    separatorLimit: string;
    apm: boolean;
    allowNegativeNumbers: boolean;
    leadZeroDateTime: boolean;
    leadZero: boolean;
    triggerOnMaskChange: boolean;
    keepCharacterPositions: boolean;
    inputTransformFn: InputTransformFn;
    outputTransformFn: OutputTransformFn;
    maskFilled: EventEmitter<void>;
    patterns: Record<
        string,
        {
            pattern: RegExp;
            optional?: boolean;
            symbol?: string;
        }
    >;
};

export type NgxMaskOptions = Partial<NgxMaskConfig>;
export const NGX_MASK_CONFIG = new InjectionToken<NgxMaskConfig>('ngx-mask config');
export const NEW_CONFIG = new InjectionToken<NgxMaskConfig>('new ngx-mask config');
export const INITIAL_CONFIG = new InjectionToken<NgxMaskConfig>('initial ngx-mask config');

export const initialConfig: NgxMaskConfig = {
    suffix: '',
    prefix: '',
    thousandSeparator: ' ',
    decimalMarker: ['.', ','],
    clearIfNotMatch: false,
    showMaskTyped: false,
    instantPrefix: false,
    placeHolderCharacter: '_',
    dropSpecialCharacters: true,
    hiddenInput: false,
    shownMaskExpression: '',
    separatorLimit: '',
    allowNegativeNumbers: false,
    validation: true,
    specialCharacters: ['-', '/', '(', ')', '.', ':', ' ', '+', ',', '@', '[', ']', '"', "'"],
    leadZeroDateTime: false,
    apm: false,
    leadZero: false,
    keepCharacterPositions: false,
    triggerOnMaskChange: false,
    inputTransformFn: (value: unknown) => value as string | number,
    outputTransformFn: (value: string | number | undefined | null) => value,
    maskFilled: new EventEmitter<void>(),
    patterns: {
        '0': {
            pattern: new RegExp('\\d'),
        },
        '9': {
            pattern: new RegExp('\\d'),
            optional: true,
        },
        X: {
            pattern: new RegExp('\\d'),
            symbol: '*',
        },
        A: {
            pattern: new RegExp('[a-zA-Z0-9]'),
        },
        S: {
            pattern: new RegExp('[a-zA-Z]'),
        },
        U: {
            pattern: new RegExp('[A-Z]'),
        },
        L: {
            pattern: new RegExp('[a-z]'),
        },
        d: {
            pattern: new RegExp('\\d'),
        },
        m: {
            pattern: new RegExp('\\d'),
        },
        M: {
            pattern: new RegExp('\\d'),
        },
        H: {
            pattern: new RegExp('\\d'),
        },
        h: {
            pattern: new RegExp('\\d'),
        },
        s: {
            pattern: new RegExp('\\d'),
        },
    },
};

export const timeMasks: string[] = [
    MaskExpression.HOURS_MINUTES_SECONDS,
    MaskExpression.HOURS_MINUTES,
    MaskExpression.MINUTES_SECONDS,
];

export const withoutValidation: string[] = [
    MaskExpression.PERCENT,
    MaskExpression.HOURS_HOUR,
    MaskExpression.SECONDS,
    MaskExpression.MINUTES,
    MaskExpression.SEPARATOR,
    MaskExpression.DAYS_MONTHS_YEARS,
    MaskExpression.DAYS_MONTHS,
    MaskExpression.DAYS,
    MaskExpression.MONTHS,
];
