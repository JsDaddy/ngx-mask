import { InjectionToken } from '@angular/core';

export interface IConfig {
    sufix: string;
    prefix: string;
    clearIfNotMatch: boolean;
    showTemplate: boolean;
    showMaskTyped: boolean;
    dropSpecialCharacters: boolean | string[];
    specialCharacters: string[];
    patterns: {
        [character: string]: {
            pattern: RegExp,
            optional?: boolean
        }
    };
}

export type optionsConfig = Partial<IConfig>;
export const config: InjectionToken<string> = new InjectionToken('config');
export const NEW_CONFIG: InjectionToken<string> = new InjectionToken('NEW_CONFIG');
export const INITIAL_CONFIG: InjectionToken<IConfig> = new InjectionToken('INITIAL_CONFIG');

export const initialConfig: IConfig = {
    sufix: '',
    prefix: '',
    clearIfNotMatch: false,
    showTemplate: false,
    showMaskTyped: false,
    dropSpecialCharacters: true,
    specialCharacters: ['/', '(', ')', '.', ':', '-', ' ', '+', ',', '@', '[', ']'],
    patterns: {
        '0': {
            pattern: new RegExp('\\d'),
        },
        '9': {
            pattern: new RegExp('\\d'),
            optional: true
        },
        'A': {
            pattern: new RegExp('\[a-zA-Z0-9\]')
        },
        'S': {
            pattern: new RegExp('\[a-zA-Z\]')
        }
    }
};
