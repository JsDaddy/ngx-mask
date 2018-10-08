import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public phone: number = 123456789;
  public customMaska: [string, pattern];

  public form: FormControl;
  public form1: FormControl;
  public formDate: FormControl;
  public cpfFormControl: FormControl;
  public clearIfNotMatch: FormControl;
  public numberOrStringForm: FormControl;
  public sufixForm: FormControl;

  public pattern: pattern =  {
    'P': {
        pattern: new RegExp('\\d'),
    }};

  public numberOrStringFormModel: string | number = '';
  public clearIfNotMatchModel: string | number = '';
  public formModelDate: string | number = '';
  public cpfModel: string | number = '';
  public dateModel: string | number = '';
  public showMaskModel: string | number = '';
  public suf: string = '+7';
  public sufixModel: string | number;


  public constructor() {
    this.form = new FormControl('');
    this.form1 = new FormControl('');
    this.formDate = new FormControl('');
    this.cpfFormControl = new FormControl();
    this.clearIfNotMatch = new FormControl();
    this.numberOrStringForm = new FormControl();
    this.sufixForm = new FormControl('');

    this.customMaska = ['PPP-PPP-PPP', this.pattern];
  }

}

type pattern = {
    [character: string]: {
        pattern: RegExp
    }
};
