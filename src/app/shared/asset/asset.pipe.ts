import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'asset',
    standalone: true,
})
export class AssetPipe implements PipeTransform {
    public transform(nameImg: string | undefined, additionalPath = '', extension = 'svg'): string {
        if (!nameImg) {
            return '';
        }
        if (additionalPath) {
            return `assets/img/${additionalPath}/${nameImg}.${extension}`;
        }
        return `assets/img/${nameImg}.svg`;
    }
}
