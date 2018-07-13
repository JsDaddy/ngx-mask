import { TestBed } from '@angular/core/testing';
import { MaskApplierService } from './mask-applier.service';
import { MaskPipe } from './mask.pipe';
import { NgxMaskModule } from './ngx-mask.module';

describe('Pipe: Mask', () => {
  let maskPipe: MaskPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxMaskModule.forRoot()]
    });
  });

  beforeEach(() => {
    const service: MaskApplierService = TestBed.get(MaskApplierService);
    maskPipe = new MaskPipe(service);
  });

  it('should mask a string', () => {
    const maskedString: string = maskPipe.transform('abcdef', 'SS-SS-SS');

    expect(maskedString).toEqual('ab-cd-ef');
  });

  it('should mask a number', () => {
    const maskedNumber: string = maskPipe.transform(123456789, '999-999-999');

    expect(maskedNumber).toEqual('123-456-789');
  });
});
