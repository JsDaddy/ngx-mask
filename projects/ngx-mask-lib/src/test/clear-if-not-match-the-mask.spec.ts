import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask', () => {
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

    it('should clear if mask is not matched', async () => {
        component.mask = '000.000-00';
        component.clearIfNotMatch = true;
        equal('', '', fixture, true);
        equal('2578989', '', fixture, true);
        equal('2578989888988', '257.898-98', fixture);
        equal('111.111-11', '111.111-11', fixture);
    });

    it('should clear if mask is not matched with prefix', async () => {
        component.mask = '000-000-00';
        component.prefix = '+5';
        component.clearIfNotMatch = true;
        equal('', '', fixture, true);
        equal('2578989', '', fixture, true);
        equal('25789898', '+5257-898-98', fixture);
    });

    it('should clear if mask is not matched with another placeholderCharacter *', async () => {
        component.mask = '0000';
        component.placeHolderCharacter = '*';
        component.clearIfNotMatch = true;
        equal('', '', fixture, true);
        equal('333', '', fixture, true);
        equal('22', '', fixture, true);
        equal('2222', '2222', fixture);
    });

    it('should clear if mask is not matched with another placeholderCharacter X', async () => {
        component.mask = '00000';
        component.placeHolderCharacter = 'X';
        component.clearIfNotMatch = true;
        equal('', '', fixture, true);
        equal('333', '', fixture, true);
        equal('22', '', fixture, true);
        equal('2222', '', fixture, true);
        equal('12345', '12345', fixture);
    });
});
