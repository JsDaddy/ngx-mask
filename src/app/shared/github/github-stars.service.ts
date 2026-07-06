import { isPlatformServer } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, resource } from '@angular/core';

@Injectable()
export class GithubStarsService {
    private readonly platformId = inject<string>(PLATFORM_ID);

    private readonly repoResource = resource({
        loader: async () => {
            if (isPlatformServer(this.platformId)) {
                return null;
            }
            try {
                const response = await fetch('https://api.github.com/repos/NepipenkoIgor/ngx-mask');
                if (!response.ok) {
                    return null;
                }
                return (await response.json()) as { stargazers_count: number };
            } catch {
                return null;
            }
        },
    });

    public readonly allStars = computed(() => this.repoResource.value()?.stargazers_count ?? 0);
}
