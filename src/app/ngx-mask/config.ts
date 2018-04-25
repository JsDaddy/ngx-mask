import { InjectionToken } from '@angular/core';

export interface IConfig {
  clearIfNotMatch: boolean;
  dropSpecialCharacters: boolean | string[];
  specialCharacters: string[];
  patterns: {
    [character: string]: {
      pattern: RegExp,
      optional?: boolean
    }
  };
}

export type optionsConfig = {
  [P in keyof IConfig]?: IConfig[P]
};

export const config: InjectionToken<string> = new InjectionToken('config');
export const NEW_CONFIG: InjectionToken<string> = new InjectionToken('NEW_CONFIG');
export const INITIAL_CONFIG: InjectionToken<IConfig> = new InjectionToken('INITIAL_CONFIG');

export const initialConfig: IConfig = {
  clearIfNotMatch: false,
  dropSpecialCharacters: true,
  specialCharacters: ['/', '(', ')', '.', ':', '-', ' ', '+', ','],
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
