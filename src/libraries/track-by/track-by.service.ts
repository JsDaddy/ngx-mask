import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TrackByService {
    public trackBy(key: string | number) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (_index: number, item: any) => {
            if (typeof item === 'object') {
                if (key in item) {
                    return item[key];
                }
                console.warn(
                    `TrackByService: ${key.toString()} is not present in ${JSON.stringify(item)} `
                );
            }
            return item;
        };
    }
}
