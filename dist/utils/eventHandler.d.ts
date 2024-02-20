export declare class EventHandlerClass {
    functionMap: {
        [key: string]: EventListener;
    };
    constructor();
    addEventListener(event: string, func: EventListener): void;
    removeEventListener(event: string): void;
    removeAllEventListeners(): void;
}
