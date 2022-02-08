import { TestBed, waitForAsync } from '@angular/core/testing';

import { ShowcaseComponent } from './showcase.component';
import { AppModule } from '../app.module';

describe('ShowcaseComponent', () => {
	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [AppModule],
			}).compileComponents();
		}),
	);

	it('should create the showcase component', () => {
		const fixture = TestBed.createComponent(ShowcaseComponent);
		const app = fixture.componentInstance;
		fixture.detectChanges();
		expect(app).toBeTruthy();
		expect(app instanceof ShowcaseComponent).toBe(true);
	});
});
