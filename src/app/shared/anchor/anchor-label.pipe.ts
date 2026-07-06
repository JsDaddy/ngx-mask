import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'anchorLabel',
    standalone: true,
})
export class AnchorLabelPipe implements PipeTransform {
    public transform(title: string | undefined): string {
        return `Navigate to ${title ?? ''}`;
    }
}
