import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from '../ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';


describe('Separator: Mask', () => {

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

  it('empty', () => {
    component.mask = 'Hh:m0:s0';
    equal('', '', fixture);
  });

  it('Hours', () => {
    component.mask = 'Hh:m0:s0';
    equal('20', '20', fixture);
  });

  it('Hours', () => {
    component.mask = 'Hh:m0:s0';
    equal('3', '03', fixture);
  });

  it('Minutes', () => {
    component.mask = 'Hh:m0:s0';
    equal('1212', '12:12', fixture);
  });

  it('Minutes', () => {
    component.mask = 'Hh:m0:s0';
    equal('127', '12:07', fixture);
  });

  it('Seconds', () => {
    component.mask = 'Hh:m0:s0';
    equal('121240', '12:12:40', fixture);
  });

  it('Seconds', () => {
    component.mask = 'Hh:m0:s0';
    equal('12127', '12:12:07', fixture);
  });
});
