import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsdaddyTestComponent } from './jsdaddy-test.component';

describe('JsdaddyTestComponent', () => {
  let component: JsdaddyTestComponent;
  let fixture: ComponentFixture<JsdaddyTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JsdaddyTestComponent]
    });
    fixture = TestBed.createComponent(JsdaddyTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
