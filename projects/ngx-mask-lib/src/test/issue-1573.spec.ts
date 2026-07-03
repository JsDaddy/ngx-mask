import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { expect, vi, afterEach } from 'vitest';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';

// Issue #1573: the mask must be locale-independent when decimalMarker/thousandSeparator
// are explicitly configured. On MS Edge with an Austrian regional format the runtime
// default locale uses ',' as decimal marker; toLocaleString-based code paths
// (numberToString / currentLocaleDecimalMarker / the #1492 exponential expansion, whose
// 'fullwide' locale tag silently falls back to the default locale) then emitted or
// consumed ',' although the mask was configured with '.' — corrupting values on
// writeValue and focus/blur reformat.
describe('Directive: Mask (issue #1573 — locale-independent separator handling)', () => {
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

        // Simulate a runtime whose DEFAULT locale uses ',' as decimal marker
        // (e.g. Edge with English (Austria) regional format). Any locale tag —
        // including the bogus 'fullwide' — falls back to the default locale,
        // so every toLocaleString call emits a comma-decimal string.
        vi.spyOn(Number.prototype, 'toLocaleString').mockImplementation(function (
            this: number
        ): string {
            return String(this).replace('.', ',');
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should not corrupt a preformatted string value on writeValue (repro 3 from #1573)', async () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        component.decimalMarker.set('.');
        const inputTarget: HTMLInputElement = fixture.debugElement.query(By.css('input'))
            .nativeElement as HTMLInputElement;
        fixture.detectChanges();

        // Under the Austrian default locale the old code replaced the "locale decimal
        // marker" (',') with the configured one ('.') turning '10,000' into '10.000'
        // and masking it as '10.00' — a 1000x value corruption.
        component.form.setValue('10,000');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('10,000');

        component.form.setValue('20,000');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('20,000');
    });

    it('should format a number FormControl with configured markers only (repro 1 from #1573)', async () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        component.decimalMarker.set('.');
        const inputTarget: HTMLInputElement = fixture.debugElement.query(By.css('input'))
            .nativeElement as HTMLInputElement;
        fixture.detectChanges();

        component.form.setValue(1234.56);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('1,234.56');
        expect(component.form.value).equal(1234.56);
    });

    it('should keep typing stable with configured markers under a comma-decimal locale (repro 2 from #1573)', () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        component.decimalMarker.set('.');
        fixture.detectChanges();

        equal('10000', '10,000', fixture);
        equal('1000.5', '1,000.5', fixture);
        equal('0.50', '0.50', fixture);
    });

    it('should expand exponential numbers without consulting the runtime locale (#1492 under comma locale)', async () => {
        component.mask.set('separator');
        const inputTarget: HTMLInputElement = fixture.debugElement.query(By.css('input'))
            .nativeElement as HTMLInputElement;
        fixture.detectChanges();

        component.form.setValue(0.0000007);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('0.0000007');
        expect(component.form.value).equal(0.0000007);
    });

    it('should expand large exponential numbers without consulting the runtime locale (#1492 under comma locale)', async () => {
        component.mask.set('separator');
        const inputTarget: HTMLInputElement = fixture.debugElement.query(By.css('input'))
            .nativeElement as HTMLInputElement;
        fixture.detectChanges();

        component.form.setValue(1e21);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('1 000 000 000 000 000 000 000');
        expect(String(component.form.value)).equal('1000000000000000000000');
    });

    it('should apply leadZero precision with configured decimalMarker under a comma-decimal locale', async () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set(',');
        component.decimalMarker.set('.');
        component.leadZero.set(true);
        const inputTarget: HTMLInputElement = fixture.debugElement.query(By.css('input'))
            .nativeElement as HTMLInputElement;
        fixture.detectChanges();

        component.form.setValue(0.5);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('0.50');
    });

    it('should keep comma-decimalMarker configs working under a comma-decimal locale', async () => {
        component.mask.set('separator.2');
        component.thousandSeparator.set('.');
        component.decimalMarker.set(',');
        const inputTarget: HTMLInputElement = fixture.debugElement.query(By.css('input'))
            .nativeElement as HTMLInputElement;
        fixture.detectChanges();

        component.form.setValue(1234.56);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(inputTarget.value).equal('1.234,56');
    });
});
