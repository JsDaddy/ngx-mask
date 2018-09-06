import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public form: FormControl;
  public dateModel: string = '';

  public cpfFormControl: FormControl;
  public cpfModel: number | string = '4787954778';

  public clearIfNotMatchForm: FormControl;
  public clearIfNotMatchModel: string;


  public constructor() {
    this.form = new FormControl('23234234');
    this.cpfFormControl = new FormControl(this.cpfModel);
    this.clearIfNotMatchForm = new FormControl();
  }

}
