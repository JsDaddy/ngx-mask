import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  templateUrl: './bugs.component.html',
})
export class BugsComponent {
  public bugsForm: FormGroup;
  public constructor(private formBuilder: FormBuilder) {
    this.bugsForm = this.formBuilder.group({ MonStart: [] });
  }
}
