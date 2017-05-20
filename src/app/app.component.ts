import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public form: FormControl;
  public dateModel: string;

  public cpfFormControl: FormControl;
  public cpfModel: string;

  public constructor() {
    this.form = new FormControl('30081991');
    this.cpfFormControl = new FormControl('04787954778');
  }

  public ngOnInit(): void { }

}
