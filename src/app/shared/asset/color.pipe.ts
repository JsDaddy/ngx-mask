import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'color',
    standalone: true,
})
export class ColorPipe implements PipeTransform {
    public transform(value: boolean | undefined): string {
        return value ? 'yellow' : 'black';
    }
}
