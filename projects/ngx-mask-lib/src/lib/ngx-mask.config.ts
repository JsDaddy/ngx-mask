import { EventEmitter, InjectionToken } from '@angular/core';
import { MaskExpression } from './ngx-mask-expression.enum';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface InputTransformFn {
    (value: unknown): string | number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface OutputTransformFn {
    (value: string | number | undefined | null): unknown;
}

export type SetValueFailureBehavior = 'ShowValidationError' | '';
export const setValueValidationError = { 'masking issue': true }; 

export interface IConfig {
    suffix: string;
    prefix: string;
    thousandSeparator: string;
    decimalMarker: '.' | ',' | ['.', ','];
    clearIfNotMatch: boolean;
    showTemplate: boolean;
    showMaskTyped: boolean;
    placeHolderCharacter: string;
    shownMaskExpression: string;
    specialCharacters: string[] | readonly string[];
    dropSpecialCharacters: boolean | string[] | readonly string[];
    hiddenInput: boolean | undefined;
    validation: boolean;
    setValueFailureBehavior: SetValueFailureBehavior;
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
    patterns: {
        [character: string]: {
            pattern: RegExp;
            optional?: boolean;
            symbol?: string;
        };
    };
}

export type optionsConfig = Partial<IConfig>;
export const NGX_MASK_CONFIG: InjectionToken<IConfig> = new InjectionToken('ngx-mask config');
export const NEW_CONFIG: InjectionToken<IConfig> = new InjectionToken('new ngx-mask config');
export const INITIAL_CONFIG: InjectionToken<IConfig> = new InjectionToken(
    'initial ngx-mask config'
);

export const initialConfig: IConfig = {
    suffix: '',
    prefix: '',
    thousandSeparator: ' ',
    decimalMarker: ['.', ','],
    clearIfNotMatch: false,
    showTemplate: false,
    showMaskTyped: false,
    placeHolderCharacter: '_',
    dropSpecialCharacters: true,
    hiddenInput: undefined,
    shownMaskExpression: '',
    separatorLimit: '',
    allowNegativeNumbers: false,
    validation: true,
    setValueFailureBehavior: '',
    // eslint-disable-next-line @typescript-eslint/quotes
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
