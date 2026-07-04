import { Component, inject } from '@angular/core';
import { VersionToken } from '@shared/version/version.token';

@Component({
    selector: 'ngxd-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    standalone: true,
})
export class FooterComponent {
    public readonly copyrightText = `© Ngx-Mask, 2018-${new Date().getFullYear()}, All Rights Reserved`;

    private readonly versionValue = inject(VersionToken, { optional: true });

    public readonly version = `v${this.versionValue ?? '*.*.*'}`;
}
