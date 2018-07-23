import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IConfig } from 'public_api';

@Component({
  selector: 'test-mask',
  template: `<input [mask]="mask"
      [clearIfNotMatch]="clearIfNotMatch"
      [dropSpecialCharacters]="dropSpecialCharacters"
      [specialCharacters]="specialCharacters"
      [patterns]="patterns"
      [formControl]="form"
      [(ngModel)]="ngModelValue">`
})
export class TestMaskComponent {
  public mask: string | null;
  public ngModelValue: string;
  public form: FormControl = new FormControl(null);
  public dropSpecialCharacters: IConfig['dropSpecialCharacters'] = true;
  public clearIfNotMatch: IConfig['clearIfNotMatch'] = false;
  public patterns: IConfig['patterns'];
  public specialCharacters: IConfig['specialCharacters'];
}
