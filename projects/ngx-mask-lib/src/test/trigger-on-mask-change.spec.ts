import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestMaskComponent } from './utils/test-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import type { DebugElement } from '@angular/core';
import { equal } from './utils/test-functions.component';

describe('Directive: Mask (Trigger on mask change)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should trigger form value update if mask is changed when triggerOnMaskChange is true', async () => {
        component.mask.set('');
        component.triggerOnMaskChange.set(true);
        fixture.detectChanges();

        component.form.setValue('7912345678');
        fixture.detectChanges();
        await fixture.whenStable();
        let inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).toEqual('7912345678');
        expect(component.form.value).toEqual('7912345678');

        component.mask.set('00 000 00 00');
        fixture.detectChanges();
        await fixture.whenStable();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).toEqual('79 123 45 67');
        expect(component.form.value).toEqual('791234567');
    });

    it('should not trigger form value update if mask is changed when triggerOnMaskChange is false', async () => {
        component.mask.set('');
        component.triggerOnMaskChange.set(false);
        fixture.detectChanges();

        component.form.setValue('7912345678');
        fixture.detectChanges();
        await fixture.whenStable();
        let inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).toEqual('7912345678');
        expect(component.form.value).toEqual('7912345678');

        component.mask.set('00 000 00 00');
        fixture.detectChanges();
        await fixture.whenStable();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).toEqual('79 123 45 67');
        expect(component.form.value).toEqual('7912345678');
    });

    it('should trigger form value update if mask is changed when triggerOnMaskChange is true', async () => {
        component.mask.set('00000||00000-0000');
        component.triggerOnMaskChange.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        equal('1234', '1234', fixture);
        expect(inputTarget.value).toEqual('1234');
        expect(component.form.value).toBe('1234');

        component.mask.set('S0S 0S0');
        equal(inputTarget.value, '', fixture, true);
        expect(component.form.value).toBe('');
    });

    it('should not trigger form value update if mask is changed when triggerOnMaskChange is false', async () => {
        component.mask.set('00000||00000-0000');
        component.triggerOnMaskChange.set(false);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        spyOnProperty(document, 'activeElement').and.returnValue(inputTarget);
        fixture.detectChanges();

        equal('1234', '1234', fixture);
        expect(inputTarget.value).toEqual('1234');
        expect(component.form.value).toBe('1234');

        component.mask.set('S0S 0S0');
        equal(inputTarget.value, '', fixture, true);
        expect(component.form.value).toBe('1234');
    });
});
