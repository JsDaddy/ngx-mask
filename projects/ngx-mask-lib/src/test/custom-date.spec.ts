import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask (Custom date)', () => {
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

    it('repeat mask', () => {
        component.mask = 'd0/m0/0000';
        // equal('18052019', '18/05/2019', fixture);
        equal('18', '18', fixture);
        equal('11111111', '11/11/1111', fixture);
    });

    it('should keep the cursor position after deleting a character', () => {
        // Set the initial input value and trigger an input event
        const inputElement = fixture.nativeElement.querySelector('input');
        component.mask = 'Hh:m0:s0';
        inputElement.value = '12:34:56';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        inputElement.setSelectionRange(3, 3);

        inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
        fixture.detectChanges();

        expect(inputElement.selectionStart).toBe(3);
    });
});
