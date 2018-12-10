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
    component.mask = '0000';
    component.sufix = ' $';
    equal('', '', fixture);
    equal('123', '123 $', fixture);
    equal('1234', '1234 $', fixture);
  });

  it('should clear if not match the mask!!!!', () => {
    component.mask = '0*.00';
    component.sufix = ' $';
    equal('', '', fixture);
    equal('12345', '12345 $', fixture);
    equal('12344.44', '12344.44 $', fixture);
  });
});
