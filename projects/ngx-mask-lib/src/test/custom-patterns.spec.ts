import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from '../lib/ngx-mask.module';
import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';

describe('Directive: Mask (Custom patterns)', () => {
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

  it('custom patterns', () => {
    component.mask = 'FFF';
    component.patterns = {
      F: {
        pattern: new RegExp('[0-9]'),
      },
    };
    equal('F', '', fixture);
    equal('123', '123', fixture);
  });
});
