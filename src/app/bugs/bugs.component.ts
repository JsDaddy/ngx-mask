import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './bugs.component.html',
})
export class BugsComponent implements OnInit, OnDestroy {
  public bugsForm: FormGroup;
  public submitted: boolean = false;

  // Can be used as a takeUntil for any observables this component may subscribe to. e.g. a form control valueChanges
  private onDestroy$ = new Subject();

  public constructor(private formBuilder: FormBuilder) {
    this.bugsForm = this.formBuilder.group({
      MonStart: [],
      PrePopulate: [123456],
      DecMarkerComma: [],
      DecMarkerDot: [],
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {}

  submitForm(): void {
    this.submitted = true;
  }

  resetForm(): void {
    this.bugsForm.reset({
      PrePopulate: 2000,
    });
    this.submitted = false;
  }
}
