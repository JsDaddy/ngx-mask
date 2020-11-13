import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from '../lib/ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

describe('Directive: Mask', () => {
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
});
