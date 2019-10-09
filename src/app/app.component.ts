import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

type SN = string | number;

interface Pattern {
  [character: string]: {
    pattern: RegExp;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public mask: string = '';
  public phone: number = 123456789;
  public customMaska: [string, Pattern];

  public form: FormControl;
  public form1: FormControl;
  public formDate: FormControl;
  public cpfFormControl: FormControl;
  public clearIfNotMatch: FormControl;
  public numberOrStringForm: FormControl;
  public suffixForm: FormControl;
  public repeatForm: FormControl;
  public separatorForm: FormControl;
  public percent: FormControl;
  public formSecureInput: FormControl;

  public pattern: Pattern = {
    P: {
      pattern: new RegExp('\\d'),
    },
  };

  public numberOrStringFormModel: SN = '';
  public clearIfNotMatchModel: SN = '';
  public formModelDate: SN = '';
  public secureMask: SN = '';
  public cpfModel: SN = '';
  public dateModel: SN = '';
  public showMaskModel: SN = '';
  public suf: string = '+7';
  public suffixModel!: SN;
  public repeatFormModel!: SN;
  public separatorFormModel!: SN;
  public separatorPrecisionSeparatorFormModel!: SN;
  public separatorZeroPrecisionSeparatorFormModel!: SN;
  public dotSeparatorFormModel!: SN;
  public dotPrecisionSeparatorFormModel: SN = '';
  public dotZeroPrecisionSeparatorFormModel!: SN;
  public commaSeparatorFormModel!: SN;
  public commaPrecisionSeparatorFormModel: SN = '';
  public commaZeroPrecisionSeparatorFormModel!: SN;
  public separatorPrecisionSeparatorForm: FormControl;
  public separatorZeroPrecisionSeparatorForm: FormControl;
  public dotSeparatorForm!: FormControl;
  public dotPrecisionSeparatorForm!: FormControl;
  public dotZeroPrecisionSeparatorForm!: FormControl;
  public commaSeparatorForm!: FormControl;
  public commaPrecisionSeparatorForm!: FormControl;
  public commaZeroPrecisionSeparatorForm!: FormControl;

  public constructor() {
    this.form = new FormControl('');
    this.form1 = new FormControl('');
    this.formDate = new FormControl('');
    this.formSecureInput = new FormControl('');
    this.cpfFormControl = new FormControl();
    this.clearIfNotMatch = new FormControl();
    this.numberOrStringForm = new FormControl();
    this.suffixForm = new FormControl('');
    this.repeatForm = new FormControl('');
    this.separatorForm = new FormControl('');
    this.separatorPrecisionSeparatorForm = new FormControl('');
    this.separatorZeroPrecisionSeparatorForm = new FormControl('');
    this.dotSeparatorForm = new FormControl('');
    this.dotPrecisionSeparatorForm = new FormControl(0);
    this.dotZeroPrecisionSeparatorForm = new FormControl('');
    this.commaSeparatorForm = new FormControl('');
    this.commaPrecisionSeparatorForm = new FormControl(0);
    this.commaZeroPrecisionSeparatorForm = new FormControl('');
    this.percent = new FormControl('');

    this.customMaska = ['PPP-PPP-PPP', this.pattern];
  }
}
