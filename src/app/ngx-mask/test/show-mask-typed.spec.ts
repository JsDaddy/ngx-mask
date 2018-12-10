import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from '../ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';


describe('Directive: Mask', () => {

  let fixture: ComponentFixture<TestMaskComponent>;
  let component: TestMaskComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestMaskComponent],
      imports: [ReactiveFormsModule, NgxMaskModule.forRoot()]
    });
    fixture = TestBed.createComponent(TestMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should clear if not match the mask!!!!', () => {
    component.mask = '(000) 000-0000';
    component.showMaskTyped = true;
    equal('', '(___) ___-____', fixture);
    equal('2345678', '(234) 567-8___', fixture);

    component.prefix = '+7';
    component.showMaskTyped = true;
    equal('', '+7(___) ___-____', fixture);
    equal('2345678', '+7(234) 567-8___', fixture);
  });

  it('should clear if not match the mask!!!!', () => {
    component.mask = 'A{5}-A{2}';
    component.showMaskTyped = true;
    equal('', '_____-__', fixture);
    equal('aaa', 'aaa__-__', fixture);
    equal('aaaaaaa', 'aaaaa-aa', fixture);
  });
});
