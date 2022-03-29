import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from '../lib/ngx-mask.module';

@Component({
	selector: 'mask-test',
	template: ` <input (done)="done()" mask="0000" [formControl]="form" /> `,
})
export class TestMaskComponent {
	public form: FormControl = new FormControl('');

	public isDone = false;

	public done(): void {
		this.isDone = true;
	}
}

describe('Directive: Mask (Function done)', () => {
	let fixture: ComponentFixture<TestMaskComponent>;
	let component: TestMaskComponent;
	let doneSpy: jasmine.Spy<jasmine.Func>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestMaskComponent],
			imports: [ReactiveFormsModule, NgxMaskModule.forRoot()],
		});
		fixture = TestBed.createComponent(TestMaskComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		doneSpy = spyOn(component, 'done').and.callThrough();
	});
	it('should call function done and isDone should be true', () => {
		component.form.setValue('9999');
		expect(component.isDone).toBeTrue();
		expect(doneSpy).toHaveBeenCalledOnceWith();
	});
	it('isDone should be false', () => {
		component.form.setValue('999');
		expect(component.isDone).toBeFalse();
	});
});
