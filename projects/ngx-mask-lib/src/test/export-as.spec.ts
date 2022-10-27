import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMaskModule } from '../lib/ngx-mask.module';
import { ReactiveFormsModule } from '@angular/forms';

import { Component, ViewChild } from '@angular/core';
import { MaskDirective } from 'ngx-mask';

@Component({
    selector: 'mask-test-mask',
    template: ` <input mask="" #refMask="mask" /> <input mask="" #refNgxMask="ngxMask" /> `,
})
export class TestMaskComponent {
    @ViewChild('refMask')
    public refMask!: MaskDirective;

    @ViewChild('refNgxMask')
    public refNgxMask!: MaskDirective;
}

describe('Directive: Mask export As', () => {
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

    it('should export directive instance with exportAs api by name equal mask', () => {
        expect(component.refMask).toBeInstanceOf(MaskDirective);
    });
    it('should export directive instance with exportAs api by name equal ngxMask', () => {
        expect(component.refNgxMask).toBeInstanceOf(MaskDirective);
    });
});
