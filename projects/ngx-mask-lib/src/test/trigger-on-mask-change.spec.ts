import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestMaskComponent } from './utils/test-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import type { DebugElement } from '@angular/core';
import { equal } from './utils/test-functions.component';
import { vi, expect } from 'vitest';

@Component({
    selector: 'ngxd-trigger-on-mask-change-ng-model',
    imports: [FormsModule, NgxMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <input
            [mask]="mask()"
            [triggerOnMaskChange]="triggerOnMaskChange()"
            [ngModel]="value()"
            (ngModelChange)="onModelChange($event)" />
    `,
})
class NgModelTriggerComponent {
    public readonly mask = signal('00000');
    public readonly triggerOnMaskChange = signal(false);
    public readonly value = signal<string | null>('56789');
    public readonly emitted: unknown[] = [];

    public onModelChange(value: string): void {
        this.emitted.push(value);
        this.value.set(value);
    }
}

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
        expect(inputEl.nativeElement.value).equal('7912345678');
        expect(component.form.value).equal('7912345678');

        component.mask.set('00 000 00 00');
        fixture.detectChanges();
        await fixture.whenStable();
        inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).equal('79 123 45 67');
        expect(component.form.value).equal('791234567');
    });

    it('should not trigger form value update if mask is changed when triggerOnMaskChange is false', async () => {
        component.mask.set('');
        component.triggerOnMaskChange.set(false);
        fixture.detectChanges();

        component.form.setValue('7912345678');
        fixture.detectChanges();
        await fixture.whenStable();
        let inputEl = fixture.debugElement.query(By.css('input'));
        expect(inputEl.nativeElement.value).equal('7912345678');
        expect(component.form.value).equal('7912345678');

        component.mask.set('00 000 00 00');
        fixture.detectChanges();
        await fixture.whenStable();
        inputEl = fixture.debugElement.query(By.css('input'));
        // Display is formatted with new mask
        expect(inputEl.nativeElement.value).equal('79 123 45 67');
        // But form value should NOT be updated when triggerOnMaskChange is false
        expect(component.form.value).equal('7912345678');
    });

    it('should trigger form value update if mask is changed when triggerOnMaskChange is true', async () => {
        component.mask.set('00000||00000-0000');
        component.triggerOnMaskChange.set(true);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        equal('1234', '1234', fixture);
        expect(inputTarget.value).equal('1234');
        expect(component.form.value).equal('1234');

        component.mask.set('S0S 0S0');
        await equal(inputTarget.value, '', fixture, true);
        expect(component.form.value).equal('');
    });

    it('should not trigger form value update if mask is changed when triggerOnMaskChange is false', async () => {
        component.mask.set('00000||00000-0000');
        component.triggerOnMaskChange.set(false);
        const debugElement: DebugElement = fixture.debugElement.query(By.css('input'));
        const inputTarget: HTMLInputElement = debugElement.nativeElement as HTMLInputElement;
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(inputTarget);
        fixture.detectChanges();

        equal('1234', '1234', fixture);
        expect(inputTarget.value).equal('1234');
        expect(component.form.value).equal('1234');

        component.mask.set('S0S 0S0');
        await equal(inputTarget.value, '', fixture, true);
        // Form value should NOT be updated when triggerOnMaskChange is false
        expect(component.form.value).equal('1234');
    });

    it('should not mark form as dirty when mask changes and triggerOnMaskChange is false', async () => {
        component.mask.set('0000');
        component.triggerOnMaskChange.set(false);
        fixture.detectChanges();

        // Set value programmatically
        component.form.setValue('1234');
        fixture.detectChanges();
        await fixture.whenStable();

        // Reset to pristine state (setValue may trigger onChange in some cases)
        component.form.markAsPristine();
        expect(component.form.pristine).equal(true);

        // Change the mask - this should NOT mark form as dirty
        component.mask.set('00-00');
        fixture.detectChanges();
        await fixture.whenStable();

        // Form should still be pristine after mask change when triggerOnMaskChange is false
        expect(component.form.pristine).equal(true);
        expect(component.form.dirty).equal(false);
    });

    it('should not mark form as dirty when mask changes from empty to pattern and triggerOnMaskChange is false', async () => {
        component.mask.set('');
        component.triggerOnMaskChange.set(false);
        fixture.detectChanges();

        // Set value programmatically
        component.form.setValue('12345678');
        fixture.detectChanges();
        await fixture.whenStable();

        // Reset to pristine state
        component.form.markAsPristine();
        expect(component.form.pristine).equal(true);

        // Apply a mask to the existing value - should NOT mark as dirty
        component.mask.set('0000-0000');
        fixture.detectChanges();
        await fixture.whenStable();

        // Form should still be pristine
        expect(component.form.pristine).equal(true);
        expect(component.form.dirty).equal(false);
    });

    it('should not mark form as dirty when mask changes with phone pattern and triggerOnMaskChange is false', async () => {
        component.mask.set('(000) 000-0000');
        component.triggerOnMaskChange.set(false);
        fixture.detectChanges();

        component.form.setValue('1234567890');
        fixture.detectChanges();
        await fixture.whenStable();

        // Reset to pristine state
        component.form.markAsPristine();
        expect(component.form.pristine).equal(true);

        // Change to a different phone mask format - should NOT mark as dirty
        component.mask.set('000-000-0000');
        fixture.detectChanges();
        await fixture.whenStable();

        // Should remain pristine when triggerOnMaskChange is false
        expect(component.form.pristine).equal(true);
        expect(component.form.dirty).equal(false);
    });

    describe('[ngModel] when the mask shrinks', () => {
        let ngModelFixture: ComponentFixture<NgModelTriggerComponent>;
        let ngModelComponent: NgModelTriggerComponent;

        const shrinkMask = async (triggerOnMaskChange: boolean): Promise<void> => {
            ngModelFixture = TestBed.createComponent(NgModelTriggerComponent);
            ngModelComponent = ngModelFixture.componentInstance;
            ngModelComponent.triggerOnMaskChange.set(triggerOnMaskChange);
            ngModelFixture.detectChanges();
            await ngModelFixture.whenStable();
            ngModelComponent.emitted.length = 0;

            ngModelComponent.mask.set('000');
            ngModelFixture.detectChanges();
            await ngModelFixture.whenStable();
        };

        it('shows the shrunk value but keeps the model when triggerOnMaskChange is false', async () => {
            await shrinkMask(false);

            expect(ngModelFixture.nativeElement.querySelector('input').value).equal('567');
            expect(ngModelComponent.emitted).toEqual([]);
            expect(ngModelComponent.value()).equal('56789');
        });

        it('writes the shrunk value back to the model when triggerOnMaskChange is true', async () => {
            await shrinkMask(true);

            expect(ngModelFixture.nativeElement.querySelector('input').value).equal('567');
            expect(ngModelComponent.emitted).toEqual(['567']);
            expect(ngModelComponent.value()).equal('567');
        });
    });
});
