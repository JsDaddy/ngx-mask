import { TestBed, waitForAsync } from '@angular/core/testing';

import { ShowcaseComponent } from './showcase.component';
import { AppComponent } from '../app.component';

describe('ShowcaseComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [AppComponent],
        }).compileComponents();
    }));

    it('should create the showcase component', () => {
        const fixture = TestBed.createComponent(ShowcaseComponent);
        const app = fixture.componentInstance;
        fixture.detectChanges();
        expect(app).toBeTruthy();
        expect(app instanceof ShowcaseComponent).toBe(true);
    });
});
