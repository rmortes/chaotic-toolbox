// Adapted from https://github.com/utsb-fmm/MobileLikeScroller/blob/main/mobilelikescroller.js
// but removing as many dependencies as possible

import { EventHandlerClass } from "../../utils/eventHandler";
// import style from './style.css';

enum ScrollDirection {
  X = 'x',
  Y = 'y',
  XY = 'xy'
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

export class MobileLikeScroller extends HTMLElement {
  static observedAttributes = ['data-direction'];
  direction!: ScrollDirection;

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

  constructor() {
    super()
    this.eventHandler = new EventHandlerClass();
    this.previousTouchX = [0, 0, 0];
    this.previousTouchY = [0, 0, 0];
    this.previousTouchTime = [0, 0, 0];
    this.scrollAtT0 = [0, 0];
    this.inertialTimerInterval = undefined;
    this.childrenEventListeners = [];
    this.childEventObject = null;
    this.blockChildrenTimeout = undefined;
    this.$BlockedInputs = [];
  }

  attributeChangedCallback() {
    this.direction = (this.dataset.direction as ScrollDirection) || ScrollDirection.XY;
  }

  connectedCallback() {
    this.applyStyles();

    this.addEventListener('mousedown', (e) => this.touchstart(e));
    this.handleScroll();
  }

  disconnectedCallback() {
    this.eventHandler.removeAllEventListeners();
  }

  applyStyles() {
    switch (this.direction) {
      case ScrollDirection.X:
        this.style.overflowX = 'auto';
        this.style.overflowY = 'hidden';
        break;
      case ScrollDirection.Y:
        this.style.overflowX = 'hidden';
        this.style.overflowY = 'auto';
        break;
      case ScrollDirection.XY:
        this.style.overflowX = 'auto';
        this.style.overflowY = 'auto';
        break;
    }
    this.style.cursor = 'grab';
    // @ts-expect-error - webkit is not in the typings
    this.style.scrollbarWidth = 'none';
  }

  touchstart(e: MouseEvent) {
    if (e.button === 0 && (e.target as any)?.onclick == null) { // Check for left click
      e.preventDefault();
      this.style.cursor = 'grabbing';
      this.previousTouchX = [e.pageX, e.pageX, e.pageX];
      this.previousTouchY = [e.pageY, e.pageY, e.pageY];
      this.previousTouchTime = [Date.now() - 2, Date.now() - 1, Date.now()];
      this.eventHandler.removeAllEventListeners();
      this.eventHandler.addEventListener('mousemove.scroller', (e) => this.touchmove(e as MouseEvent));
      this.eventHandler.addEventListener('mouseup.scroller', () => this.touchend());
      this.eventHandler.addEventListener('click.scroller', () => this.click());
      if (this.inertialTimerInterval) {
        clearInterval(this.inertialTimerInterval);
        this.inertialTimerInterval = undefined;
      }
      this.childEventObject = null;
      this.blockChildrenTimeout = setTimeout(() => { this.preventChildClicks(); }, 300); // Prevent children from being clicked after 300ms when we are sure that the user is grabbing the parent to scroll
    }
  }

  touchmove(e: MouseEvent) {
    if (e.buttons === 0) {
      this.touchend();
      return;
    }
    this.previousTouchX = [this.previousTouchX[1], this.previousTouchX[2], e.pageX];
    this.previousTouchY = [this.previousTouchY[1], this.previousTouchY[2], e.pageY];
    this.previousTouchTime = [this.previousTouchTime[1], this.previousTouchTime[2], Date.now()];
    if (this.direction != 'y') this.scrollLeft -= this.previousTouchX[2] - this.previousTouchX[1];
    if (this.direction != 'x') this.scrollTop -= this.previousTouchY[2] - this.previousTouchY[1];

    if (this.blockChildrenTimeout && (this.previousTouchX[2] - this.previousTouchX[1]) ** 2 + (this.previousTouchY[2] - this.previousTouchY[1]) ** 2 > 25) {
      // If fast mouse movement, this is not a click on children, do not wait 300ms
      this.preventChildClicks();
    }
    this.dispatchEvent(new Event('scroll'));

  }

  touchend() {
    this.eventHandler.removeEventListener('mousemove.scroller');
    this.eventHandler.removeEventListener('mouseup.scroller');
    this.style.cursor = '';
    this.scrollAtT0 = [this.scrollLeft, this.scrollTop];
    this.inertialTimerInterval = setInterval(() => this.inertialmove(), 16);
    this.dispatchEvent(new Event('initiateinertial'));
  }

  click() {
    this.eventHandler.removeEventListener('click.scroller');
    if (this.blockChildrenTimeout === null) {
      this.childrenEventListeners.forEach((t) => {
        t[0].removeEventListener('click', t[1], true);
      });
      this.childrenEventListeners = [];
      setTimeout(() => { // The event for the change is done after the click event, so we need to wait for the click event to be done before re-enabling the inputs
        this.$BlockedInputs.forEach((input) => {
          input.removeAttribute('disabled');
        });
        this.$BlockedInputs = [];
      }, 0);
    }
    else {
      clearTimeout(this.blockChildrenTimeout);
      this.blockChildrenTimeout = undefined;
    }
  }

  preventChildClicks() {
    this.querySelectorAll('*:not([data-ui]):not([data-ui] *)').forEach((elem) => {
      let listener = (e: Event) => this.childclick(e);
      elem.addEventListener('click', listener, true)
      this.childrenEventListeners.push([elem, listener]);
    });
    this.$BlockedInputs = [...this.querySelectorAll('input:not(:disabled)')]
    this.$BlockedInputs.forEach((input) => {
      input.setAttribute('disabled', 'true');
    });
    clearInterval(this.blockChildrenTimeout);
    this.blockChildrenTimeout = undefined;
  }

  childclick(e: Event) {
    e.stopPropagation();
    this.click();
  }

  inertialmove() {
    var v0X = 0, v0Y = 0;
    if (this.direction != 'y') v0X = (this.previousTouchX[2] - this.previousTouchX[0]) / (this.previousTouchTime[2] - this.previousTouchTime[0]) * 1000 / this.getBoundingClientRect().width;  // page per second    
    if (this.direction != 'x') v0Y = (this.previousTouchY[2] - this.previousTouchY[0]) / (this.previousTouchTime[2] - this.previousTouchTime[0]) * 1000 / this.getBoundingClientRect().height;  // page per second

    var av0 = this.direction == 'xy' ? Math.sqrt(v0X * v0X + v0Y * v0Y) : (this.direction == 'y' ? Math.abs(v0Y) : Math.abs(v0X));
    var unitVector = [v0X / av0, v0Y / av0];
    av0 = Math.min(12, Math.max(-12, 1.2 * av0));

    var t = (Date.now() - this.previousTouchTime[2]) / 1000;
    var v = av0 - 14.278 * t + 75.24 * t * t / av0 - 149.72 * t * t * t / av0 / av0;

    if (av0 == 0 || v <= 0 || isNaN(av0)) {
      clearInterval(this.inertialTimerInterval);
      this.inertialTimerInterval = undefined;
      this.dispatchEvent(new Event('scrollend'));
    } else {
      var deltaX = this.getBoundingClientRect().width * unitVector[0] * (av0 * t - 7.1397 * t * t + 25.08 * t * t * t / av0 - 37.43 * t * t * t * t / av0 / av0);
      var deltaY = this.getBoundingClientRect().height * unitVector[1] * (av0 * t - 7.1397 * t * t + 25.08 * t * t * t / av0 - 37.43 * t * t * t * t / av0 / av0);
      let maxScroll = [this.scrollWidth - this.getBoundingClientRect().width, this.scrollHeight - this.getBoundingClientRect().height];
      let newScroll = [Math.min(maxScroll[0], Math.max(0, this.scrollAtT0[0] - deltaX)), Math.min(maxScroll[1], Math.max(0, this.scrollAtT0[1] - deltaY))];

      if ((newScroll[0] == 0 || newScroll[0] == maxScroll[0]) && (newScroll[1] == 0 || newScroll[1] == maxScroll[1])) {
        clearInterval(this.inertialTimerInterval);
        this.inertialTimerInterval = undefined;
      }
      if (this.direction != 'y')
        this.scrollLeft = newScroll[0];
      if (this.direction != 'x')
        this.scrollTop = newScroll[1];
      this.dispatchEvent(new Event('scroll'));
    }
  }

  handleScroll() {
    this.addEventListener('customscroll', (e) => {
      if (e instanceof CustomEvent) {
        e.preventDefault();
        e.stopPropagation();
        const axis = e.detail.axis as 'x' | 'y';
        const amount = e.detail.amount;
        const behavior = e.detail.behavior;
        if (axis === 'x') {
          this.applyScroll([amount, 0], behavior);
        }
        if (axis === 'y') {
          this.applyScroll([0, amount], behavior);
        }
      }
    });
    this.querySelectorAll('*[data-scroll-axis]').forEach((elem) => elem.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const target = e.target as HTMLElement | undefined;
      const axis = target?.dataset?.scrollAxis;
      const amount = parseFloat(target?.dataset?.scrollAmount ?? '0');
      const behavior = target?.dataset?.scrollBehavior;
      if (["x", "y"].includes(axis ?? '')) {
        e.target?.dispatchEvent(new CustomEvent('customscroll', {
          bubbles: true, detail: { axis, amount, behavior }
        }));

      }
    }));
  }

  /**
   * @param scrollAmount - Array of two numbers, the first is the amount to scroll in the x direction, the second is the amount to scroll in the y direction
   */
  applyScroll([scrollLeft, scrollTop] = [0, 0], behavior: 'auto' | 'smooth' = 'smooth') {
    this.scrollTo({
      top: this.scrollTop + scrollTop,
      left: this.scrollLeft + scrollLeft,
      behavior,
    });
  };

}


customElements.define('mobile-like-scroller', MobileLikeScroller);
// document.head.appendChild(style);