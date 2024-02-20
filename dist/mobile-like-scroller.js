var p = Object.defineProperty;
var T = (h, i, t) => i in h ? p(h, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : h[i] = t;
var o = (h, i, t) => (T(h, typeof i != "symbol" ? i + "" : i, t), t);
class m {
  constructor() {
    o(this, "functionMap");
    this.functionMap = {};
  }
  addEventListener(i, t) {
    this.functionMap[i] = t, document.addEventListener(i.split(".")[0], this.functionMap[i]);
  }
  removeEventListener(i) {
    document.removeEventListener(i.split(".")[0], this.functionMap[i]), delete this.functionMap[i];
  }
  removeAllEventListeners() {
    for (const i in this.functionMap)
      document.removeEventListener(i.split(".")[0], this.functionMap[i]), delete this.functionMap[i];
  }
}
class u extends HTMLElement {
  constructor() {
    super();
    o(this, "direction");
    o(this, "eventHandler");
    o(this, "previousTouchX");
    o(this, "previousTouchY");
    o(this, "previousTouchTime");
    o(this, "scrollAtT0");
    o(this, "inertialTimerInterval");
    o(this, "childrenEventListeners");
    o(this, "childEventObject");
    o(this, "blockChildrenTimeout");
    o(this, "$BlockedInputs");
    this.eventHandler = new m(), this.previousTouchX = [0, 0, 0], this.previousTouchY = [0, 0, 0], this.previousTouchTime = [0, 0, 0], this.scrollAtT0 = [0, 0], this.inertialTimerInterval = void 0, this.childrenEventListeners = [], this.childEventObject = null, this.blockChildrenTimeout = void 0, this.$BlockedInputs = [];
  }
  attributeChangedCallback() {
    this.direction = this.dataset.direction || "xy";
  }
  connectedCallback() {
    this.applyStyles(), this.addEventListener("mousedown", (t) => this.touchstart(t));
  }
  disconnectedCallback() {
    this.eventHandler.removeAllEventListeners();
  }
  applyStyles() {
    switch (this.direction) {
      case "x":
        this.style.overflowX = "auto", this.style.overflowY = "hidden";
        break;
      case "y":
        this.style.overflowX = "hidden", this.style.overflowY = "auto";
        break;
      case "xy":
        this.style.overflowX = "auto", this.style.overflowY = "auto";
        break;
    }
    this.style.cursor = "grab", this.style.scrollbarWidth = "none";
  }
  touchstart(t) {
    t.button === 0 && (t.preventDefault(), this.style.cursor = "grabbing", this.previousTouchX = [t.pageX, t.pageX, t.pageX], this.previousTouchY = [t.pageY, t.pageY, t.pageY], this.previousTouchTime = [Date.now() - 2, Date.now() - 1, Date.now()], this.eventHandler.removeAllEventListeners(), this.eventHandler.addEventListener("mousemove.scroller", (r) => this.touchmove(r)), this.eventHandler.addEventListener("mouseup.scroller", () => this.touchend()), this.eventHandler.addEventListener("click.scroller", () => this.click()), this.inertialTimerInterval && (clearInterval(this.inertialTimerInterval), this.inertialTimerInterval = void 0), this.childEventObject = null, this.blockChildrenTimeout = setTimeout(() => {
      this.preventChildClicks();
    }, 300));
  }
  touchmove(t) {
    if (t.buttons === 0) {
      this.touchend();
      return;
    }
    this.previousTouchX = [this.previousTouchX[1], this.previousTouchX[2], t.pageX], this.previousTouchY = [this.previousTouchY[1], this.previousTouchY[2], t.pageY], this.previousTouchTime = [this.previousTouchTime[1], this.previousTouchTime[2], Date.now()], this.direction != "y" && (this.scrollLeft -= this.previousTouchX[2] - this.previousTouchX[1]), this.direction != "x" && (this.scrollTop -= this.previousTouchY[2] - this.previousTouchY[1]), this.blockChildrenTimeout && (this.previousTouchX[2] - this.previousTouchX[1]) ** 2 + (this.previousTouchY[2] - this.previousTouchY[1]) ** 2 > 25 && this.preventChildClicks(), this.dispatchEvent(new Event("scroll"));
  }
  touchend() {
    this.eventHandler.removeEventListener("mousemove.scroller"), this.eventHandler.removeEventListener("mouseup.scroller"), this.style.cursor = "", this.scrollAtT0 = [this.scrollLeft, this.scrollTop], this.inertialTimerInterval = setInterval(() => this.inertialmove(), 16), this.dispatchEvent(new Event("initiateinertial"));
  }
  click() {
    this.eventHandler.removeEventListener("click.scroller"), this.blockChildrenTimeout === null ? (this.childrenEventListeners.forEach((t) => {
      t[0].removeEventListener("click", t[1], !0);
    }), this.childrenEventListeners = [], setTimeout(() => {
      this.$BlockedInputs.forEach((t) => {
        t.removeAttribute("disabled");
      }), this.$BlockedInputs = [];
    }, 0)) : (clearTimeout(this.blockChildrenTimeout), this.blockChildrenTimeout = void 0);
  }
  preventChildClicks() {
    this.querySelectorAll("*").forEach((t) => {
      let r = (s) => this.childclick(s);
      t.addEventListener("click", r, !0), this.childrenEventListeners.push([t, r]);
    }), this.$BlockedInputs = [...this.querySelectorAll("input:not(:disabled)")], this.$BlockedInputs.forEach((t) => {
      t.setAttribute("disabled", "true");
    }), clearInterval(this.blockChildrenTimeout), this.blockChildrenTimeout = void 0;
  }
  childclick(t) {
    t.stopPropagation(), this.click();
  }
  inertialmove() {
    var t = 0, r = 0;
    this.direction != "y" && (t = (this.previousTouchX[2] - this.previousTouchX[0]) / (this.previousTouchTime[2] - this.previousTouchTime[0]) * 1e3 / this.getBoundingClientRect().width), this.direction != "x" && (r = (this.previousTouchY[2] - this.previousTouchY[0]) / (this.previousTouchTime[2] - this.previousTouchTime[0]) * 1e3 / this.getBoundingClientRect().height);
    var s = this.direction == "xy" ? Math.sqrt(t * t + r * r) : this.direction == "y" ? Math.abs(r) : Math.abs(t), c = [t / s, r / s];
    s = Math.min(12, Math.max(-12, 1.2 * s));
    var e = (Date.now() - this.previousTouchTime[2]) / 1e3, a = s - 14.278 * e + 75.24 * e * e / s - 149.72 * e * e * e / s / s;
    if (s == 0 || a <= 0 || isNaN(s))
      clearInterval(this.inertialTimerInterval), this.inertialTimerInterval = void 0, this.dispatchEvent(new Event("scrollend"));
    else {
      var v = this.getBoundingClientRect().width * c[0] * (s * e - 7.1397 * e * e + 25.08 * e * e * e / s - 37.43 * e * e * e * e / s / s), d = this.getBoundingClientRect().height * c[1] * (s * e - 7.1397 * e * e + 25.08 * e * e * e / s - 37.43 * e * e * e * e / s / s);
      let l = [this.scrollWidth - this.getBoundingClientRect().width, this.scrollHeight - this.getBoundingClientRect().height], n = [Math.min(l[0], Math.max(0, this.scrollAtT0[0] - v)), Math.min(l[1], Math.max(0, this.scrollAtT0[1] - d))];
      (n[0] == 0 || n[0] == l[0]) && (n[1] == 0 || n[1] == l[1]) && (clearInterval(this.inertialTimerInterval), this.inertialTimerInterval = void 0), this.direction != "y" && (this.scrollLeft = n[0]), this.direction != "x" && (this.scrollTop = n[1]), this.dispatchEvent(new Event("scroll"));
    }
  }
}
o(u, "observedAttributes", ["data-direction"]);
customElements.define("mobile-like-scroller", u);
export {
  u as MobileLikeScroller
};
