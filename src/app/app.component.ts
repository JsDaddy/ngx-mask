import { Component } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  form: FormControl;
  dateModel: string;

  cpfFormControl: FormControl;
  cpfModel: string;

  constructor(private fb: FormBuilder) {

    this.form = new FormControl('30081991');
    this.cpfFormControl = new FormControl('04787954778');

  }

}
