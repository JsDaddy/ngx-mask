import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { Component, viewChild } from '@angular/core';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

@Component({
    selector: 'jsdaddy-open-source-test',
    standalone: true,
    imports: [NgxMaskDirective],
    template: ` <input mask="" #refMask="mask" /> <input mask="" #refNgxMask="ngxMask" /> `,
})
export class TestMaskComponent {
    public refNgxMask = viewChild<NgxMaskDirective>('refNgxMask');
    public refMask = viewChild<NgxMaskDirective>('refMask');
}

describe('Directive: Mask export As', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NgxMaskDirective, TestMaskComponent],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should export directive instance with exportAs api by name equal mask', () => {
        expect(component.refMask()).toBeInstanceOf(NgxMaskDirective);
    });
    it('should export directive instance with exportAs api by name equal ngxMask', () => {
        expect(component.refNgxMask()).toBeInstanceOf(NgxMaskDirective);
    });
});
