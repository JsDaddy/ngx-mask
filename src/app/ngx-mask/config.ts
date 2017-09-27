import { InjectionToken } from '@angular/core';

export const config: InjectionToken<string> = new InjectionToken('config');

export const initialConfig: Config = {
  clearIfNotMatch: false,
  dropSpecialCharacters: true,
  specialCharacters: ['/', '(', ')', '.', ':', '-', ' ', '+'],
  patterns: {
    '0': new RegExp('\\d'),
    '9': new RegExp('\\d'),
    'A': new RegExp('\[a-zA-Z0-9\]'),
    'S': new RegExp('\[a-zA-Z\]')
  }
};