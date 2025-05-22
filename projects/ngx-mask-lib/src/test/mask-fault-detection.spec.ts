import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './utils/test-component.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';
import { NgxMaskFaultDetectionService } from '../lib/ngx-mask-fault-detection.service';
import { NgxMaskService } from '../lib/ngx-mask.service';

describe('MaskFaultDetectionService', () => {
    let fixture: ComponentFixture<TestMaskComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should detect no issues if the mask is applied without any unexpected losses', async () => {
        const faultSvc = TestBed.inject(NgxMaskFaultDetectionService);
        const maskSvc = TestBed.inject(NgxMaskService);

        const inputValue = "123";
        const maskExpression = maskSvc.maskExpression = "AAA";

        const maskedValue = maskSvc.applyMask(inputValue, maskExpression);
        const maskingFault = faultSvc.maskApplicationFault(maskedValue, inputValue);

        expect(maskingFault).toBe(false);
    });

    it('should detect an issue if the mask is applied with any unexpected losses', async () => {
        const faultSvc = TestBed.inject(NgxMaskFaultDetectionService);
        const maskSvc = TestBed.inject(NgxMaskService);

        const inputValue = "123";
        const maskExpression = maskSvc.maskExpression = "AAS";

        const maskedValue = maskSvc.applyMask(inputValue, maskExpression);
        const maskingFault = faultSvc.maskApplicationFault(maskedValue, inputValue);

        expect(maskingFault).toBe(true);
    });
});
