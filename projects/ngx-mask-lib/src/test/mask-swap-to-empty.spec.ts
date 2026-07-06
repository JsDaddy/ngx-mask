import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestMaskComponent } from './utils/test-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Directive: Mask (swap mask to empty on populated control)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('reverts input value and form value to raw when mask is swapped to empty string', async () => {
        component.mask.set('00 000 00 00');
        component.triggerOnMaskChange.set(true);
        fixture.detectChanges();

        component.form.setValue('7912345678');
        fixture.detectChanges();
        await fixture.whenStable();

        let inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).equal('79 123 45 67');
        expect(component.form.value).equal('791234567');

        component.mask.set('');
        fixture.detectChanges();
        await fixture.whenStable();

        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).equal('7912345678');
        expect(component.form.value).equal('7912345678');
    });

    it('control case: reformats value when mask is swapped to a different non-empty mask', async () => {
        component.mask.set('00 000 00 00');
        component.triggerOnMaskChange.set(true);
        fixture.detectChanges();

        component.form.setValue('7912345678');
        fixture.detectChanges();
        await fixture.whenStable();

        let inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).equal('79 123 45 67');
        expect(component.form.value).equal('791234567');

        component.mask.set('000-000-000');
        fixture.detectChanges();
        await fixture.whenStable();

        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).equal('791-234-567');
        expect(component.form.value).equal('791234567');
    });
});
