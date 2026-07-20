import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

type GlobalPolyfillTarget = Record<string, unknown>;

// Polyfill DataTransfer for jsdom
if (typeof DataTransfer === 'undefined') {
    (globalThis as GlobalPolyfillTarget)['DataTransfer'] = class DataTransfer {
        private data: Record<string, string> = {};
        public dropEffect = 'none';
        public effectAllowed = 'all';
        public files = [];
        public items = [];
        public types = [];

        public setData(format: string, data: string) {
            const normalizedFormat = format.toLowerCase() === 'text' ? 'text/plain' : format;
            this.data[normalizedFormat] = data;
        }

        public getData(format: string) {
            const normalizedFormat = format.toLowerCase() === 'text' ? 'text/plain' : format;
            return this.data[normalizedFormat] || '';
        }

        public clearData() {
            this.data = {};
        }
    };
}

type ClipboardEventOptions = EventInit & { clipboardData?: DataTransfer | null };

// Polyfill ClipboardEvent if needed
if (typeof ClipboardEvent === 'undefined') {
    (globalThis as GlobalPolyfillTarget)['ClipboardEvent'] = class ClipboardEvent extends Event {
        public clipboardData: DataTransfer | null;
        public constructor(type: string, options?: ClipboardEventOptions) {
            super(type, options);
            this.clipboardData = options?.clipboardData ?? null;
        }
    };
}

type DragEventOptions = MouseEventInit & { dataTransfer?: DataTransfer | null };

// Polyfill DragEvent if needed
if (typeof DragEvent === 'undefined') {
    (globalThis as GlobalPolyfillTarget)['DragEvent'] = class DragEvent extends MouseEvent {
        public dataTransfer: DataTransfer | null;
        public constructor(type: string, options?: DragEventOptions) {
            super(type, options);
            this.dataTransfer = options?.dataTransfer ?? null;
        }
    };
}

TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
});
