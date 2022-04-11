import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { NgxMaskModule } from '../lib/ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';

describe('Directive: Mask (Trigger on mask change)', () => {
	let fixture: ComponentFixture<TestMaskComponent>;
	let component: TestMaskComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestMaskComponent],
			imports: [ReactiveFormsModule, NgxMaskModule.forRoot()],
		});
		fixture = TestBed.createComponent(TestMaskComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		fixture.destroy();
	});

	it('should trigger form value update if mask is changed', async () => {
		component.mask = '';
		component.triggerOnMaskChange = true;
		fixture.detectChanges();

		component.form.setValue('7912345678');
		fixture.detectChanges();
		await fixture.whenStable();
		let inputEl = fixture.debugElement.query(By.css('input'));
		expect(inputEl.nativeElement.value).toEqual('7912345678');
		expect(component.form.value).toEqual('7912345678');

		component.mask = '00 000 00 00';
		fixture.detectChanges();
		await fixture.whenStable();
		inputEl = fixture.debugElement.query(By.css('input'));
		expect(inputEl.nativeElement.value).toEqual('79 123 45 67');
		expect(component.form.value).toEqual('791234567');
	});
});
