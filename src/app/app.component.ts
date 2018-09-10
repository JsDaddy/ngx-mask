import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  public form: FormControl;
  public formDate: FormControl;
  public cpfFormControl: FormControl;
  public clearIfNotMatch: FormControl;
  public numberOrStringForm: FormControl;

  public numberOrStringFormModel: string | number = '';
  public clearIfNotMatchModel: string | number = '';
  public formModelDate: string | number = '';
  public cpfModel: string | number = '';
  public dateModel: string | number = '';


  public constructor() {
    this.form = new FormControl('');
    this.formDate = new FormControl('');
    this.cpfFormControl = new FormControl();
    this.clearIfNotMatch = new FormControl();
    this.numberOrStringForm = new FormControl();
  }

}
