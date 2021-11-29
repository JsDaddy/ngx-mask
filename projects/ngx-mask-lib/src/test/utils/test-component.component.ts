import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { IConfig } from '../../lib/config';

@Component({
  selector: 'ngx-mask-test-mask',
  template: `
    <ng-container *ngIf="mask">
      <input
        id="mask"
        [mask]="mask"
        [clearIfNotMatch]="clearIfNotMatch"
        [dropSpecialCharacters]="dropSpecialCharacters"
        [specialCharacters]="specialCharacters"
        [patterns]="patterns"
        [suffix]="suffix"
        [prefix]="prefix"
        [thousandSeparator]="thousandSeparator"
        [decimalMarker]="decimalMarker"
        [formControl]="form"
        [showMaskTyped]="showMaskTyped"
        [placeHolderCharacter]="placeHolderCharacter"
        [separatorLimit]="separatorLimit"
        [hiddenInput]="hiddenInput"
        [allowNegativeNumbers]="allowNegativeNumbers"
        [leadZeroDateTime]="leadZeroDateTime"
      />
    </ng-container>
  `,
})
export class TestMaskComponent {
  public mask!: string;

  public form: FormControl = new FormControl(null);

  public dropSpecialCharacters: IConfig['dropSpecialCharacters'] = true;

  public clearIfNotMatch: IConfig['clearIfNotMatch'] = false;

  public patterns!: IConfig['patterns'];

  public prefix: IConfig['prefix'] = '';

  public thousandSeparator: IConfig['thousandSeparator'] = ' ';

  public decimalMarker: IConfig['decimalMarker'] = ',';

  public suffix: IConfig['suffix'] = '';

  public specialCharacters!: IConfig['specialCharacters'];

  public showMaskTyped: IConfig['showMaskTyped'] = false;

  public placeHolderCharacter: IConfig['placeHolderCharacter'] = '_';

  public hiddenInput: IConfig['hiddenInput'] = false;

  public separatorLimit: IConfig['separatorLimit'] = '';

  public allowNegativeNumbers: IConfig['allowNegativeNumbers'] = false;

  public leadZeroDateTime: IConfig['leadZeroDateTime'] = false;
}
