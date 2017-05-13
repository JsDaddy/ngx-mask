import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: ['30/08/1991']
    });
  }

}
