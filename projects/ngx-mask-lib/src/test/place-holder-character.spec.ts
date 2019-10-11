import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from '../lib/ngx-mask.module';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

describe('Directive: Mask (Placeholder character)', () => {
  let fixture: ComponentFixture<TestMaskComponent>;
  let component: TestMaskComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestMaskComponent],
      imports: [ReactiveFormsModule, NgxMaskModule.forRoot()],
    });
    fixture = TestBed.createComponent(TestMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the default placeholder when not configured', () => {
    component.mask = '(000) 000-0000';
    component.showMaskTyped = true;
    equal('', '(___) ___-____', fixture);
    equal('2345678', '(234) 567-8___', fixture);

    component.prefix = '+7';
    component.showMaskTyped = true;
    equal('', '+7(___) ___-____', fixture);
    equal('2345678', '+7(234) 567-8___', fixture);

    component.mask = 'IP';
    component.prefix = '';
    component.showMaskTyped = true;
    equal('', '_._._._', fixture);
    equal('1921681', '192.168.1_', fixture);
  });

  it('should display the modified placeholder when configured', () => {
    component.mask = '(000) 000-0000';
    component.showMaskTyped = true;
    component.placeHolderCharacter = '*';
    equal('', '(***) ***-****', fixture);
    equal('2345678', '(234) 567-8***', fixture);

    component.prefix = '+7';
    component.showMaskTyped = true;
    equal('', '+7(***) ***-****', fixture);
    equal('2345678', '+7(234) 567-8***', fixture);

    component.mask = 'IP';
    component.prefix = '';
    component.showMaskTyped = true;
    equal('', '*.*.*.*', fixture);
    equal('1921681', '192.168.1*', fixture);
  });
});
