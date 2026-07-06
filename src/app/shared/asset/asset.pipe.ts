import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { AssetPath } from '@shared/asset/asset.type';

@Pipe({
    name: 'asset',
    standalone: true,
})
export class AssetPipe implements PipeTransform {
    public transform(
        nameImg: string | undefined,
        additionalPath: AssetPath | string = '',
        isWebp = false
    ): string {
        if (!nameImg) {
            return '';
        }
        if (additionalPath) {
            return `assets/images/${additionalPath}/${nameImg}.${isWebp ? 'webp' : 'svg'}`;
        }
        return `assets/images/${nameImg}.svg`;
    }
}
