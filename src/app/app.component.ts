import { Component, ElementRef } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import * as highlightjs from 'highlight.js';

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

    highlightjs.initHighlighting();

  }

}
