import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	templateUrl: './bugs.component.html',
})
export class BugsComponent implements OnInit, OnDestroy {
	public bugsForm: FormGroup;

	public submitted: boolean = false;

	public mask = 'XXX-XX-XXXX';

	// Can be used as a takeUntil for any observables this component may subscribe to. e.g. a form control valueChanges
	private onDestroy$ = new Subject<void>();

	public constructor(private formBuilder: FormBuilder) {
		this.bugsForm = this.formBuilder.group({
			MonStart: [],
			PrePopulate: [123456],
			DecMarkerComma: [],
			DecMarkerDot: [],
			CorrectRemovingSpace: [1200300.99],
			SecureInput: [987654321],
      ScientificNotation: [0.0000005],
		});
	}

	public ngOnDestroy(): void {
		this.onDestroy$.next();
		this.onDestroy$.complete();
	}

	public ngOnInit(): void {
		this.bugsForm
			.get('SecureInput')
			?.valueChanges.pipe(takeUntil(this.onDestroy$))
			.subscribe(() => {
				if (this.bugsForm.get('SecureInput')?.valid) {
					this.mask = '000-00-0000';
				} else {
					this.mask = 'XXX-X0-0000';
				}
			});
	}

	public submitForm(): void {
		this.submitted = true;
	}

	public resetForm(): void {
		this.bugsForm.reset({
			PrePopulate: 2000,
		});
		this.submitted = false;
	}
}
