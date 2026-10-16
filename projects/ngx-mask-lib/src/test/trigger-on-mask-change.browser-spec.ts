import { mount } from './utils/browser-harness';
import { TriggerOnMaskChangeHarnessComponent } from './utils/trigger-on-mask-change-harness.component';

describe('Directive: Mask (Trigger on mask change)', () => {
    it('should put back initial value if mask is toggled', async () => {
        const m = await mount(TriggerOnMaskChangeHarnessComponent);

        await m.type('#masked', '7912345678');
        await expect.poll(() => m.get('#masked').value).toBe('7912345678');
        await expect.poll(() => m.text('.formvalue')).toBe('7912345678');

        await m.click('input[value="ch"]');
        await expect.poll(() => m.get('input#masked').value).toBe('79 123 45 67');
        await expect.poll(() => m.text('.formvalue')).toBe('791234567');

        await m.click('input[value="de"]');
        await expect.poll(() => m.get('input#masked').value).toBe('7912345678');
        await expect.poll(() => m.text('.formvalue')).toBe('7912345678');
    });
});
