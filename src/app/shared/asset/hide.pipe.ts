import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hide',
    standalone: true,
})
export class HidePipe implements PipeTransform {
    public transform(value: boolean | undefined): string {
        return value ? 'show' : 'hide';
    }
}
