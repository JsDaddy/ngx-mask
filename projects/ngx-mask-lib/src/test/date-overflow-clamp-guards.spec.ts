import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgxMaskService, provideNgxMask } from 'ngx-mask';

import { setUserEdit, userEditFor } from '../lib/caret/date-overflow';

/**
 * The 00 clamp of `leadZeroDateTime` reads the edit the directive recorded for the service. Two
 * guards keep that record from clamping anything but the edit it describes: it only applies to the
 * value that edit produced, and never to a value being written. Each row kills one guard.
 */
describe('00 clamp guards', () => {
    const mask = 'd0/M0/0000';
    let service: NgxMaskService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideNgxMask()] });
        service = TestBed.inject(NgxMaskService);
        service.leadZeroDateTime = true;
        setUserEdit(service, { value: '00062020', start: 0, end: 8 });
    });

    it('clamps the value the recorded edit produced', () => {
        expect(service.applyMask('00062020', mask)).toBe('01/06/2020');
    });

    it('does not clamp a value being written, even one equal to the recorded edit', () => {
        service.writingValue = true;

        expect(service.applyMask('00062020', mask)).toBe('00/06/2020');
    });

    it('does not clamp a render of any other value than the recorded edit produced', () => {
        expect(service.applyMask('00/06/2020', mask)).toBe('00/06/2020');
        expect(userEditFor(service, '00/06/2020')).toBeNull();
        expect(userEditFor(service, '00062020')).not.toBeNull();
    });

    it('does not clamp once the edit was cleared', () => {
        setUserEdit(service, null);

        expect(service.applyMask('00062020', mask)).toBe('00/06/2020');
    });
});
