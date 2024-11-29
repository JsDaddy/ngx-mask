import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

describe('Directive: Mask (Add prefix)', () => {
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

    it('should have a prefix', () => {
        component.mask.set('00-000-000-00');
        component.prefix.set('+7 ');
        equal('6', '+7 6', fixture);

        component.mask.set('(00) 0000-0000||(00) 0 0000-0000');
        component.prefix.set('+55 ');
        component.showMaskTyped.set(true);
        equal('1', '+55 (1_) ____-____', fixture);
        equal('12', '+55 (12) ____-____', fixture);
        equal('123', '+55 (12) 3___-____', fixture);
        equal('1234', '+55 (12) 34__-____', fixture);
        equal('12345', '+55 (12) 345_-____', fixture);
        equal('123456', '+55 (12) 3456-____', fixture);
        equal('1234567', '+55 (12) 3456-7___', fixture);
        equal('12345678', '+55 (12) 3456-78__', fixture);
        equal('123456789', '+55 (12) 3456-789_', fixture);
        equal('1234567890', '+55 (12) 3456-7890', fixture);
        equal('12345678901', '+55 (12) 3 4567-8901', fixture);
        equal('+55 (1', '+55 (1_) ____-____', fixture);
        equal('+55 (12', '+55 (12) ____-____', fixture);
        equal('+55 (12)', '+55 (12) ____-____', fixture);
        equal('+55 (12) 3', '+55 (12) 3___-____', fixture);
        equal('+55 (12) 34', '+55 (12) 34__-____', fixture);
        equal('+55 (12) 345', '+55 (12) 345_-____', fixture);
        equal('+55 (12) 3456', '+55 (12) 3456-____', fixture);
        equal('+55 (12) 3456-7', '+55 (12) 3456-7___', fixture);
        equal('+55 (12) 3456-78', '+55 (12) 3456-78__', fixture);
        equal('+55 (12) 3456-789', '+55 (12) 3456-789_', fixture);
        equal('+55 (12) 3456-7890', '+55 (12) 3456-7890', fixture);
        equal('+55 (12) 3 4567-8901', '+55 (12) 3 4567-8901', fixture);
    });
    it('dropSpecialCharacters false should return value with prefix', () => {
        component.mask.set('00-000-000-00');
        component.dropSpecialCharacters.set(false);
        component.prefix.set('+7 ');
        equal('097', '+7 09-7', fixture);
        expect(component.form.value).toEqual('+7 09-7');
    });
    it('dropSpecialCharacters false should return value with suffix', () => {
        component.mask.set('00');
        component.dropSpecialCharacters.set(false);
        component.suffix.set('$');
        equal('97', '97$', fixture);
        expect(component.form.value).toEqual('97$');
    });

    it('should delete prefix in pasted content', () => {
        component.mask.set('AAA-AAA-AAA');
        component.prefix.set('FOO-');
        equal('FOO-D', 'FOO-D', fixture);
        equal('FOO-DD', 'FOO-DD', fixture);
        equal('FOO-DDD', 'FOO-DDD', fixture);
        equal('FOO-DDD-D', 'FOO-DDD-D', fixture);
        equal('FOO-DDD-DD', 'FOO-DDD-DD', fixture);
        equal('FOO-DDD-DDD', 'FOO-DDD-DDD', fixture);
        equal('FOO-DDD-DDD-D', 'FOO-DDD-DDD-D', fixture);
        equal('FOO-DDD-DDD-DD', 'FOO-DDD-DDD-DD', fixture);
        equal('FOO-DDD-DDD-DDD', 'FOO-DDD-DDD-DDD', fixture);
        expect(component.form.value).toEqual('DDDDDDDDD');
    });

    it('should delete prefix in pasted content', () => {
        component.mask.set('AAA-AAA-AAA');
        component.prefix.set('FOO-');
        component.dropSpecialCharacters.set(false);
        equal('FOO-S', 'FOO-S', fixture);
        equal('FOO-SS', 'FOO-SS', fixture);
        equal('FOO-SSS', 'FOO-SSS', fixture);
        equal('FOO-SSS-S', 'FOO-SSS-S', fixture);
        equal('FOO-SSS-SS', 'FOO-SSS-SS', fixture);
        equal('FOO-SSS-SSS', 'FOO-SSS-SSS', fixture);
        equal('FOO-SSS-SSS-S', 'FOO-SSS-SSS-S', fixture);
        equal('FOO-SSS-SSS-SS', 'FOO-SSS-SSS-SS', fixture);
        equal('FOO-SSS-SSS-SSS', 'FOO-SSS-SSS-SSS', fixture);
        expect(component.form.value).toEqual('FOO-SSS-SSS-SSS');
    });

    it('should replace $ with minus', () => {
        component.mask.set('0000.00');
        component.prefix.set('$');
        component.allowNegativeNumbers.set(true);
        equal('-1', '-$1', fixture);
        equal('-12', '-$12', fixture);
        equal('-123', '-$123', fixture);
        equal('-1234', '-$1234', fixture);
        equal('-12345', '-$1234.5', fixture);
        equal('-123456', '-$1234.56', fixture);
    });

    it('should replace euro with minus', () => {
        component.mask.set('0000.00');
        component.prefix.set('€');
        component.allowNegativeNumbers.set(true);
        equal('-1', '-€1', fixture);
        equal('-12', '-€12', fixture);
        equal('-123', '-€123', fixture);
        equal('-1234', '-€1234', fixture);
        equal('-12345', '-€1234.5', fixture);
        equal('-123456', '-€1234.56', fixture);
    });

    it('should remove prefix when setValue triggerOnMaskChange = true', () => {
        component.mask.set('000 000');
        component.prefix.set('KZ');
        component.dropSpecialCharacters.set(true);
        component.triggerOnMaskChange.set(true);
        component.form.setValue('KZ123123');
        equal('KZ123123', 'KZ123 123', fixture);
        expect(component.form.value).toBe('123123');
    });

    it('should remove prefix when setValue triggerOnMaskChange =true', () => {
        component.mask.set('000 000');
        component.prefix.set('KZ');
        component.dropSpecialCharacters.set(false);
        component.triggerOnMaskChange.set(true);
        component.form.setValue('KZ123123');

        equal('KZ123123', 'KZ123 123', fixture);
        expect(component.form.value).toBe('KZ123 123');
    });

    it('should remove prefix when setValue triggerOnMaskChange = false', () => {
        component.mask.set('000 000');
        component.prefix.set('KZ');
        component.dropSpecialCharacters.set(true);
        component.form.setValue('KZ123123');
        equal('KZ123123', 'KZ123 123', fixture);
        expect(component.form.value).toBe('KZ123123');
    });

    it('should remove prefix when setValue triggerOnMaskChange = false', () => {
        component.mask.set('000 000');
        component.prefix.set('KZ');
        component.dropSpecialCharacters.set(false);
        component.form.setValue('KZ123123');
        equal('KZ123123', 'KZ123 123', fixture);
        expect(component.form.value).toBe('KZ123123');
    });
});
