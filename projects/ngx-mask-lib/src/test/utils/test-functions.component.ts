export const Paste = 'Paste';
export const Type = 'Type';

export function pasteTest(inputValue: string, fixture: any): string {
    fixture.detectChanges();

    fixture.nativeElement.querySelector('input').value = inputValue;

    fixture.nativeElement.querySelector('input').dispatchEvent(new Event('paste'));
    fixture.nativeElement.querySelector('input').dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('input').dispatchEvent(new Event('ngModelChange'));

    return fixture.nativeElement.querySelector('input').value;
}

export function typeTest(inputValue: string, fixture: any): string {
    fixture.detectChanges();
    const inputArray = inputValue.split('');
    const inputElement = fixture.nativeElement.querySelector('input');

    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('ngModelChange'));

    {
        for (const element of inputArray) {
            inputElement.dispatchEvent(new KeyboardEvent('keydown'), { key: element });
            if (inputElement.type === 'text') {
                const selectionStart = inputElement.selectionStart || 0;
                const selectionEnd = inputElement.selectionEnd || 0;
                inputElement.value =
                    inputElement.value.slice(0, selectionStart) +
                    element +
                    inputElement.value.slice(selectionEnd);

                inputElement.selectionStart = selectionStart + 1;
            } else {
                inputElement.value += element;
            }
            inputElement.dispatchEvent(new Event('input'));
            inputElement.dispatchEvent(new Event('ngModelChange'));
        }
    }
    return inputElement.value;
}

// Functions for textarea
export function pasteTestTextarea(inputValue: string, fixture: any): string {
    fixture.detectChanges();

    fixture.nativeElement.querySelector('textarea').value = inputValue;

    fixture.nativeElement.querySelector('textarea').dispatchEvent(new Event('paste'));
    fixture.nativeElement.querySelector('textarea').dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('textarea').dispatchEvent(new Event('ngModelChange'));

    return fixture.nativeElement.querySelector('textarea').value;
}

export function typeTestTextarea(inputValue: string, fixture: any): string {
    fixture.detectChanges();
    const inputArray = inputValue.split('');
    const textareaElement = fixture.nativeElement.querySelector('textarea');

    textareaElement.value = '';
    textareaElement.dispatchEvent(new Event('input'));
    textareaElement.dispatchEvent(new Event('ngModelChange'));

    {
        for (const element of inputArray) {
            textareaElement.dispatchEvent(new KeyboardEvent('keydown'), { key: element });
            const selectionStart = textareaElement.selectionStart || 0;
            const selectionEnd = textareaElement.selectionEnd || 0;
            textareaElement.value =
                textareaElement.value.slice(0, selectionStart) +
                element +
                textareaElement.value.slice(selectionEnd);

            textareaElement.selectionStart = selectionStart + 1;
            textareaElement.dispatchEvent(new Event('input'));
            textareaElement.dispatchEvent(new Event('ngModelChange'));
        }
    }
    return textareaElement.value;
}

export function equal(
    value: string,
    expectedValue: string,
    fixture: any,
    async = false,
    testType: typeof Paste | typeof Type = Type
): void {
    if (testType === Paste) {
        pasteTest(value, fixture);
    } else {
        typeTest(value, fixture);
    }

    if (async) {
        Promise.resolve().then(() => {
            expect(fixture.nativeElement.querySelector('input').value).toBe(expectedValue);
        });
        return;
    }
    expect(fixture.nativeElement.querySelector('input').value).toBe(expectedValue);
}

export function equalTextarea(
    value: string,
    expectedValue: string,
    fixture: any,
    async = false,
    testType: typeof Paste | typeof Type = Type
): void {
    if (testType === Paste) {
        pasteTestTextarea(value, fixture);
    } else {
        typeTestTextarea(value, fixture);
    }

    if (async) {
        Promise.resolve().then(() => {
            expect(fixture.nativeElement.querySelector('textarea').value).toBe(expectedValue);
        });
        return;
    }
    expect(fixture.nativeElement.querySelector('textarea').value).toBe(expectedValue);
}
