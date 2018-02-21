import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public form: FormControl;
  public dateModel: string;

  public cpfFormControl: FormControl;
  public cpfModel: string;

  public clearIfNotMatchForm: FormControl;
  public clearIfNotMatchModel: string;

  public constructor() {
    this.form = new FormControl('1234567891');
    this.cpfFormControl = new FormControl('04787954778');
    this.clearIfNotMatchForm = new FormControl();
  }

}
