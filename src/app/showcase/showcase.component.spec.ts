import { async, TestBed } from '@angular/core/testing';

import { ShowcaseComponent } from './showcase.component';
import { AppModule } from '../app.module';

describe('ShowcaseComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  }));

  it('should create the showcase component', () => {
    const fixture = TestBed.createComponent(ShowcaseComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeObject();
    expect(app instanceof ShowcaseComponent).toBeTrue();
  });
});
