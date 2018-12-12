// tslint:disable-next-line:no-any
export function typeTest(inputValue: string, fixture: any): string {

    fixture.detectChanges();

    fixture.nativeElement.querySelector('input').value = inputValue;

    fixture.nativeElement.querySelector('input')
        .dispatchEvent(new Event('input'));

    fixture.detectChanges();
    return fixture.nativeElement.querySelector('input').value;
}

// tslint:disable-next-line:no-any
export function equal(value: string, expectedValue: string, fixture: any): void {
    expect(typeTest(value, fixture))
        .toBe(expectedValue);
}