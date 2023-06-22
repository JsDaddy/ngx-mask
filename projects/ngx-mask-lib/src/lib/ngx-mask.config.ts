import { EventEmitter, InjectionToken } from '@angular/core';

export const enum ConfigExpression {
    MINUTES = 'm0',
    HOURS_HOUR = 'Hh',
    SECONDS = 's0',
    DAYS_MONTHS_YEARS = 'd0/M0/0000',
    HOURS_MINUTES_SECONDS = 'Hh:m0:s0',
    HOURS_MINUTES = 'Hh:m0',
    MINUTES_SECONDS = 'm0:s0',
    DAYS_MONTHS = 'd0/M0',
    DAYS = 'd0',
    SEPARATOR = 'separator',
    MONTHS = 'M0',
    PERCENT = 'percent',
}

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
    dropSpecialCharacters: boolean | string[];
    specialCharacters: string[];
    hiddenInput: boolean | undefined;
    validation: boolean;
    separatorLimit: string;
    allowNegativeNumbers: boolean;
    leadZeroDateTime: boolean;
    leadZero: boolean;
    triggerOnMaskChange: boolean;
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
    // eslint-disable-next-line @typescript-eslint/quotes
    specialCharacters: ['-', '/', '(', ')', '.', ':', ' ', '+', ',', '@', '[', ']', '"', "'"],
    leadZeroDateTime: false,
    leadZero: false,
    triggerOnMaskChange: false,
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
    ConfigExpression.HOURS_MINUTES_SECONDS,
    ConfigExpression.HOURS_MINUTES,
    ConfigExpression.MINUTES_SECONDS,
];

export const withoutValidation: string[] = [
    ConfigExpression.PERCENT,
    ConfigExpression.HOURS_HOUR,
    ConfigExpression.SECONDS,
    ConfigExpression.MINUTES,
    ConfigExpression.SEPARATOR,
    ConfigExpression.DAYS_MONTHS_YEARS,
    ConfigExpression.DAYS_MONTHS,
    ConfigExpression.DAYS,
    ConfigExpression.MONTHS,
];
