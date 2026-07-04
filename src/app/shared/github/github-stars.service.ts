import { isPlatformServer } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, resource } from '@angular/core';

@Injectable()
export class GithubStarsService {
    private readonly platformId = inject<string>(PLATFORM_ID);

    private readonly reposResource = resource({
        loader: async () => {
            if (isPlatformServer(this.platformId)) {
                return [];
            }
            try {
                const response = await fetch('https://api.github.com/users/NepipenkoIgor/repos');
                if (!response.ok) {
                    return [];
                }
                return (await response.json()) as { stargazers_count: number }[];
            } catch {
                return [];
            }
        },
    });

    public readonly allStars = computed(() => {
        const repos = this.reposResource.value() ?? [];
        return repos.reduce((acc, { stargazers_count }) => acc + stargazers_count, 0);
    });
}
