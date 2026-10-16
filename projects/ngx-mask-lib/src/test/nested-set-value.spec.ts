import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestMaskComponent } from './utils/test-component.component';

describe('Directive: setValue called inside a valueChanges subscriber (#1691)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;
    let input: HTMLInputElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        component.mask.set('0000');
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input');
    });

    it('shows the nested write, not the stale value of the outer write', async () => {
        let nested = false;
        component.form.valueChanges.subscribe((value) => {
            if (value === '1234' && !nested) {
                nested = true;
                component.form.setValue('99999');
            }
        });

        component.form.setValue('12345');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.form.value).toBe('9999');
        expect(input.value).toBe('9999');
    });

    it('still renders a plain write after a nested one', async () => {
        let nested = false;
        const subscription = component.form.valueChanges.subscribe((value) => {
            if (value === '1234' && !nested) {
                nested = true;
                component.form.setValue('99999');
            }
        });
        component.form.setValue('12345');
        fixture.detectChanges();
        await fixture.whenStable();
        subscription.unsubscribe();

        component.form.setValue('5678');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(input.value).toBe('5678');
        expect(component.form.value).toBe('5678');
    });
});
