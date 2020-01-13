import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

type SN = string | number;

interface Pattern {
  [character: string]: {
    pattern: RegExp;
  };
}

@Component({
  templateUrl: './showcase.component.html',
})
export class ShowcaseComponent {
  public mask: string = '';
  public phone: number = 123456789;
  public customMaska: [string, Pattern];
  public pipeSeparatorValue: string = '123456789';

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
  public customPatternForm: FormControl;
  public hourTimeForm: FormControl;
  public hourForm: FormControl;
  public hour24Form: FormControl;
  public mixedTypeForm: FormControl;
  public dateMonthForm: FormControl;

  public pattern: Pattern = {
    P: {
      pattern: new RegExp('\\d'),
    },
  };

  public surnamePattern = { N: { pattern: new RegExp(`[A-Za-z '-]`) } };

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
  public customPatternFormModel!: SN;
  public separatorFormModel!: SN;
  public separatorPrecisionSeparatorFormModel!: SN;
  public separatorZeroPrecisionSeparatorFormModel!: SN;
  public dotSeparatorFormModel!: string;
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
    this.customPatternForm = new FormControl('');
    this.hourTimeForm = new FormControl('');
    this.hourForm = new FormControl('');
    this.hour24Form = new FormControl('');
    this.mixedTypeForm = new FormControl('');
    this.dateMonthForm = new FormControl('');

    this.customMaska = ['PPP-PPP-PPP', this.pattern];
  }
}
