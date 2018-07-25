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

  it('FormControl or NgModel should be filled without special characters', () => {
    component.mask = '00-00-00';
    component.dropSpecialCharacters = false;
    equal('257898', '25-78-98', fixture);
    expect(component.form.value)
      .toBe('25-78-98');
    expect(component.ngModelValue)
      .toBe('25-78-98');


    component.mask = '00-00/00';
    component.dropSpecialCharacters = ['/'];
    equal('257898', '25-78/98', fixture);
    expect(component.form.value)
      .toBe('25-7898');
    expect(component.ngModelValue)
      .toBe('25-7898');

  });
});
