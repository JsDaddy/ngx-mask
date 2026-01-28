import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

// Polyfill DataTransfer for jsdom
if (typeof DataTransfer === 'undefined') {
    (global as any).DataTransfer = class DataTransfer {
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

// Polyfill ClipboardEvent if needed
if (typeof ClipboardEvent === 'undefined') {
    (global as any).ClipboardEvent = class ClipboardEvent extends Event {
        public clipboardData: any;
        public constructor(type: string, options?: any) {
            super(type, options);
            this.clipboardData = options?.clipboardData;
        }
    };
}

// Polyfill DragEvent if needed
if (typeof DragEvent === 'undefined') {
    (global as any).DragEvent = class DragEvent extends MouseEvent {
        public dataTransfer: any;
        public constructor(type: string, options?: any) {
            super(type, options);
            this.dataTransfer = options?.dataTransfer;
        }
    };
}

TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
});
