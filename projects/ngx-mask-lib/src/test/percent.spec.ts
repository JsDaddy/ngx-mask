import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from '../lib/ngx-mask.module';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

describe('Directive: Mask (Percent)', () => {
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

	it('percent for empty', () => {
		component.mask = 'percent';
		equal('', '', fixture);
	});

	it('percent for 100', () => {
		component.mask = 'percent';
		equal('100', '100', fixture);
	});

	it('percent for 99', () => {
		component.mask = 'percent';
		equal('99', '99', fixture);
	});

	it('percent for 123', () => {
		component.mask = 'percent';
		equal('123', '12', fixture);
	});

	it('percent for 99.99', () => {
		component.mask = 'percent';
		equal('99.99', '99.99', fixture);
	});

	it('percent for 99', () => {
		component.mask = 'percent.0';
		equal('99.99999', '99', fixture);
	});

	it('percent for 99.99', () => {
		component.mask = 'percent.2';
		equal('99.9999', '99.99', fixture);
	});

	it('percent for 1.123', () => {
		component.mask = 'percent.3';
		equal('1.12345', '1.123', fixture);
	});

	it('percent for 123.23', () => {
		component.mask = 'percent';
		equal('123.23', '12.23', fixture);
	});

	it('percent with suffix', () => {
		component.mask = 'percent';
		component.suffix = '%';
		equal('50', '50%', fixture);
		equal('123', '12%', fixture);
		equal('50.50', '50.50%', fixture);
	});
});
