import { TestBed } from '@angular/core/testing';
import {  NgxMaskService,provideNgxMask} from 'ngx-mask';

describe('NgxMaskService', () => {
  let service: NgxMaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgxMask(),
        NgxMaskService
      ]
    });
    service = TestBed.inject(NgxMaskService);
  });

  it('should not call toFixed with "separator" precision and leadZero is true', () => {
    const originalToFixed = Number.prototype.toFixed;
    const spy = spyOn(Number.prototype, 'toFixed').and.callFake(function (this: Number, digits: number) {
      if (!isFinite(digits)) {
        fail(` toFixed() called with invalid precision: ${digits}`);
      }
      return originalToFixed.call(this, digits);
    });
    service.leadZero = true;
    service._checkPrecision('separator', '123456.78');

    expect(spy).not.toHaveBeenCalled();
  });
});
