import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
    name: 'isEmpty',
    standalone: true,
})
export class IsEmptyPipe implements PipeTransform {
    public transform(value: string | number | undefined): string {
        return String(value) || 'Empty';
    }
}
