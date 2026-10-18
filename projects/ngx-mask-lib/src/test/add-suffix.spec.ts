import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { createHarness } from './utils/characterization-harness';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

describe('Directive: Mask (Add suffix)', () => {
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

    it('should have a suffix', () => {
        component.mask.set('00-000-000-00');
        component.suffix.set('$');
        equal('6', '6$', fixture);
    });

    it('should have a suffix if first letter entered is y', () => {
        component.mask.set('L{80}');
        component.suffix.set('.sh');
        equal('y', 'y.sh', fixture);
    });

    it('should have a suffix if the first character entered same as the last letter of the suffix', () => {
        component.mask.set('L{80}');
        component.suffix.set('.sh');
        equal('h', 'h.sh', fixture);
    });

    it('should keep a value that collides with the suffix text (#1495)', () => {
        component.mask.set('Hh');
        component.suffix.set(':00');
        component.dropSpecialCharacters.set(false);
        equal('00', '00:00', fixture);
    });

    it('should display suffix at the end with showMaskTyped mask 0 000', () => {
        component.mask.set('0 000');
        component.suffix.set('$');
        component.showMaskTyped.set(true);
        equal('1', '1 ___$', fixture);
        equal('12', '1 2__$', fixture);
        equal('123', '1 23_$', fixture);
        equal('1234', '1 234$', fixture);
    });
});

describe('Directive: Mask (Delete in front of the suffix)', () => {
    const setUp = async (keepCharacterPositions: boolean) => {
        const harness = createHarness();
        harness.component.mask.set('000');
        harness.component.suffix.set(' kg');
        harness.component.keepCharacterPositions.set(keepCharacterPositions);
        harness.component.showMaskTyped.set(keepCharacterPositions);
        await harness.settle();
        return harness;
    };

    for (const keepCharacterPositions of [false, true]) {
        const label = keepCharacterPositions ? 'keepCharacterPositions' : 'plain';

        it(`should prevent Delete at the end of a typed value (${label})`, async () => {
            const harness = await setUp(keepCharacterPositions);
            harness.el.setSelectionRange(0, 0);
            await harness.type('123');
            const snap = await harness.edit({ start: 3, end: 3, key: 'Delete' });
            expect(snap).toEqual({ value: '123 kg', caret: 3, model: '123', prevented: true });
        });

        it(`should prevent Delete at the end of a written value (${label})`, async () => {
            const harness = await setUp(keepCharacterPositions);
            await harness.write('123');
            const snap = await harness.edit({ start: 3, end: 3, key: 'Delete' });
            expect(snap).toEqual({ value: '123 kg', caret: 3, model: '123', prevented: true });
        });

        it(`should prevent Delete with the caret inside the suffix (${label})`, async () => {
            const harness = await setUp(keepCharacterPositions);
            await harness.write('123');
            const snap = await harness.edit({ start: 4, end: 4, key: 'Delete' });
            expect(snap).toEqual({ value: '123 kg', caret: 3, model: '123', prevented: true });
        });

        it(`should still delete a digit in front of the digits' end (${label})`, async () => {
            const harness = await setUp(keepCharacterPositions);
            await harness.write('123');
            const snap = await harness.edit({ start: 2, end: 2, key: 'Delete' });
            expect(snap.prevented).toBe(false);
            expect(snap.model).toBe('12');
        });
    }
});
