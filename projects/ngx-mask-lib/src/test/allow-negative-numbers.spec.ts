import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask (Allow negative numbers)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('FormControl or NgModel should not allow negative numbers (default functionality)', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        component.allowNegativeNumbers = false;
        component.dropSpecialCharacters = true;
        equal('-10,000.00', '10,000.00', fixture);

        expect(component.form.value).toBe('10000.00');

        component.form.setValue(-123456);
        equal('-123456.00', '123,456.00', fixture);
        expect(component.form.value).toBe(123456);
    });

    it('FormControl and NgModel should be filled with negative values', () => {
        component.mask = 'separator.2';
        component.thousandSeparator = ',';
        component.allowNegativeNumbers = true;
        component.dropSpecialCharacters = true;
        component.form.setValue(-123456);

        equal('-123456.00', '-123,456.00', fixture);
        expect(component.form.value).toBe(-123456);
    });
});
