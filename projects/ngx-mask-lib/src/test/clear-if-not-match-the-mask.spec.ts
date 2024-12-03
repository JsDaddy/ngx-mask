import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

describe('Directive: Mask', () => {
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

    it('should clear if mask is not matched', async () => {
        component.mask.set('000.000-00');
        component.clearIfNotMatch.set(true);
        equal('', '', fixture, true);
        equal('2578989', '', fixture, true);
        equal('2578989888988', '257.898-98', fixture);
        equal('111.111-11', '111.111-11', fixture);
    });

    it('should clear if mask is not matched with prefix', async () => {
        component.mask.set('000-000-00');
        component.prefix.set('+5');
        component.clearIfNotMatch.set(true);
        equal('', '', fixture, true);
        equal('2578989', '', fixture, true);
        equal('25789898', '+5257-898-98', fixture);
    });

    it('should clear if mask is not matched with another placeholderCharacter *', async () => {
        component.mask.set('0000');
        component.placeHolderCharacter.set('*');
        component.clearIfNotMatch.set(true);
        equal('', '', fixture, true);
        equal('333', '', fixture, true);
        equal('22', '', fixture, true);
        equal('2222', '2222', fixture);
    });

    it('should clear if mask is not matched with another placeholderCharacter X', async () => {
        component.mask.set('00000');
        component.placeHolderCharacter.set('X');
        component.clearIfNotMatch.set(true);
        equal('', '', fixture, true);
        equal('333', '', fixture, true);
        equal('22', '', fixture, true);
        equal('2222', '', fixture, true);
        equal('12345', '12345', fixture);
    });
});
