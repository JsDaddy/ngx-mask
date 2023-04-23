import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { Component, ViewChild } from '@angular/core';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

@Component({
    selector: 'jsdaddy-open-source-test',
    template: ` <input mask="" #refMask="mask" /> <input mask="" #refNgxMask="ngxMask" /> `,
})
export class TestMaskComponent {
    @ViewChild('refMask')
    public refMask!: NgxMaskDirective;

    @ViewChild('refNgxMask')
    public refNgxMask!: NgxMaskDirective;
}

describe('Directive: Mask export As', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should export directive instance with exportAs api by name equal mask', () => {
        expect(component.refMask).toBeInstanceOf(NgxMaskDirective);
    });
    it('should export directive instance with exportAs api by name equal ngxMask', () => {
        expect(component.refNgxMask).toBeInstanceOf(NgxMaskDirective);
    });
});
