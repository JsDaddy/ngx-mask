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

  it('separator for empty', () => {
    component.mask = 'separator';
    equal('', '', fixture);
  });

  it('separator for 100', () => {
    component.mask = 'separator';
    equal('100', '100', fixture);
  });

  it('separator for 1000', () => {
    component.mask = 'separator';
    equal('1000', '1 000', fixture);
  });

  it('separator for 10000', () => {
    component.mask = 'separator';
    equal('10000', '10 000', fixture);
  });

  it('separator for 100000', () => {
    component.mask = 'separator';
    equal('100000', '100 000', fixture);
  });

  it('separator for 1000000', () => {
    component.mask = 'separator';
    equal('1000000', '1 000 000', fixture);
  });

  it('separator for letters', () => {
    component.mask = 'separator';
    equal('a', '', fixture);
    equal('1a', '1', fixture);
    equal('1000a', '1 000', fixture);
    equal('1000/', '1 000', fixture);
  });
});
