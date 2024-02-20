/// <reference types="react" />
import { EventHandlerClass } from "../../utils/eventHandler";
declare enum ScrollDirection {
    X = "x",
    Y = "y",
    XY = "xy"
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'mobile-like-scroller': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                'data-direction'?: ScrollDirection | `${ScrollDirection}`;
            }, HTMLElement>;
        }
    }
}
export declare class MobileLikeScroller extends HTMLElement {
    static observedAttributes: string[];
    direction: ScrollDirection;
    eventHandler: EventHandlerClass;
    previousTouchX: [number, number, number];
    previousTouchY: [number, number, number];
    previousTouchTime: [number, number, number];
    scrollAtT0: [number, number];
    inertialTimerInterval: number | undefined;
    childrenEventListeners: [Element, (e: Event) => void][];
    childEventObject: null;
    blockChildrenTimeout: number | undefined;
    $BlockedInputs: Element[];
    constructor();
    attributeChangedCallback(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    applyStyles(): void;
    touchstart(e: MouseEvent): void;
    touchmove(e: MouseEvent): void;
    touchend(): void;
    click(): void;
    preventChildClicks(): void;
    childclick(e: Event): void;
    inertialmove(): void;
}
export {};
