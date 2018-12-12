import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IConfig } from 'public_api';

@Component({
  selector: 'test-mask',
  template: `<input id='maska' [mask]="mask"
      [clearIfNotMatch]="clearIfNotMatch"
      [dropSpecialCharacters]="dropSpecialCharacters"
      [specialCharacters]="specialCharacters"
      [patterns]="patterns"
      [sufix]="sufix"
      [prefix]="prefix"
      [formControl]="form"
      [showMaskTyped] = "showMaskTyped"
      [(ngModel)]="ngModelValue">`,
})
export class TestMaskComponent {
  public mask: string | null;
  public ngModelValue: string | number;
  public form: FormControl = new FormControl(null);
  public dropSpecialCharacters: IConfig['dropSpecialCharacters'] = true;
  public clearIfNotMatch: IConfig['clearIfNotMatch'] = false;
  public patterns: IConfig['patterns'];
  public prefix: IConfig['prefix'] = '';
  public sufix: IConfig['sufix'] = '';
  public specialCharacters: IConfig['specialCharacters'];
  public showMaskTyped: IConfig['showMaskTyped'] = false;
}
