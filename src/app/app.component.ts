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
  // public clearIfNotMatchFormNumber: FormControl;
  public clearIfNotMatchFormDate: FormControl;
  public clearIfNotMatchModel: string;
  // public clearIfNotMatchModelNumber: string;
  public clearIfNotMatchModelDate: string;


  public constructor() {
    this.form = new FormControl('2323423412');
    this.cpfFormControl = new FormControl(this.cpfModel);
    this.clearIfNotMatchForm = new FormControl();
    // this.clearIfNotMatchFormNumber = new FormControl();
    this.clearIfNotMatchFormDate = new FormControl();
  }

}
