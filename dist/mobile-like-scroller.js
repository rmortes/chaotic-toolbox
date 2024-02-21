var p = Object.defineProperty;
var T = (l, o, t) => o in l ? p(l, o, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[o] = t;
var r = (l, o, t) => (T(l, typeof o != "symbol" ? o + "" : o, t), t);
class m {
  constructor() {
    r(this, "functionMap");
    this.functionMap = {};
  }
  addEventListener(o, t) {
    this.functionMap[o] = t, document.addEventListener(o.split(".")[0], this.functionMap[o]);
  }
  removeEventListener(o) {
    document.removeEventListener(o.split(".")[0], this.functionMap[o]), delete this.functionMap[o];
  }
  removeAllEventListeners() {
    for (const o in this.functionMap)
      document.removeEventListener(o.split(".")[0], this.functionMap[o]), delete this.functionMap[o];
  }
}
var E = ((l) => (l.X = "x", l.Y = "y", l.XY = "xy", l))(E || {});
class d extends HTMLElement {
  constructor() {
    super();
    r(this, "direction");
    r(this, "eventHandler");
    r(this, "previousTouchX");
    r(this, "previousTouchY");
    r(this, "previousTouchTime");
    r(this, "scrollAtT0");
    r(this, "inertialTimerInterval");
    r(this, "childrenEventListeners");
    r(this, "childEventObject");
    r(this, "blockChildrenTimeout");
    r(this, "$BlockedInputs");
    this.eventHandler = new m(), this.previousTouchX = [0, 0, 0], this.previousTouchY = [0, 0, 0], this.previousTouchTime = [0, 0, 0], this.scrollAtT0 = [0, 0], this.inertialTimerInterval = void 0, this.childrenEventListeners = [], this.childEventObject = null, this.blockChildrenTimeout = void 0, this.$BlockedInputs = [];
  }
  attributeChangedCallback() {
    this.direction = this.dataset.direction || "xy";
  }
  connectedCallback() {
    this.applyStyles(), this.addEventListener("mousedown", (t) => this.touchstart(t)), this.handleScroll();
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
    }
    this.style.cursor = "grab", this.style.scrollbarWidth = "none";
  }
  touchstart(t) {
    var s;
    t.button === 0 && ((s = t.target) == null ? void 0 : s.onclick) == null && (t.preventDefault(), this.style.cursor = "grabbing", this.previousTouchX = [t.pageX, t.pageX, t.pageX], this.previousTouchY = [t.pageY, t.pageY, t.pageY], this.previousTouchTime = [Date.now() - 2, Date.now() - 1, Date.now()], this.eventHandler.removeAllEventListeners(), this.eventHandler.addEventListener("mousemove.scroller", (e) => this.touchmove(e)), this.eventHandler.addEventListener("mouseup.scroller", () => this.touchend()), this.eventHandler.addEventListener("click.scroller", () => this.click()), this.inertialTimerInterval && (clearInterval(this.inertialTimerInterval), this.inertialTimerInterval = void 0), this.childEventObject = null, this.blockChildrenTimeout = setTimeout(() => {
      this.preventChildClicks();
    }, 300));
  }
  touchmove(t) {
    t.buttons !== 0 ? (this.previousTouchX = [this.previousTouchX[1], this.previousTouchX[2], t.pageX], this.previousTouchY = [this.previousTouchY[1], this.previousTouchY[2], t.pageY], this.previousTouchTime = [this.previousTouchTime[1], this.previousTouchTime[2], Date.now()], this.direction != "y" && (this.scrollLeft -= this.previousTouchX[2] - this.previousTouchX[1]), this.direction != "x" && (this.scrollTop -= this.previousTouchY[2] - this.previousTouchY[1]), this.blockChildrenTimeout && (this.previousTouchX[2] - this.previousTouchX[1]) ** 2 + (this.previousTouchY[2] - this.previousTouchY[1]) ** 2 > 25 && this.preventChildClicks(), this.dispatchEvent(new Event("scroll"))) : this.touchend();
  }
  touchend() {
    this.eventHandler.removeEventListener("mousemove.scroller"), this.eventHandler.removeEventListener("mouseup.scroller"), this.style.cursor = "", this.scrollAtT0 = [this.scrollLeft, this.scrollTop], this.inertialTimerInterval = setInterval(() => this.inertialmove(), 16), this.dispatchEvent(new Event("initiateinertial"));
  }
  click() {
    this.eventHandler.removeEventListener("click.scroller"), this.childrenEventListeners.forEach(([t, s]) => {
      t.removeEventListener("click", s, !0);
    }), this.childrenEventListeners = [], setTimeout(() => {
      this.$BlockedInputs.forEach((t) => {
        t.removeAttribute("disabled");
      }), this.$BlockedInputs = [];
    }, 0);
  }
  preventChildClicks() {
    this.querySelectorAll("*:not([data-ui]):not([data-ui] *)").forEach((t) => {
      let s = (e) => this.childclick(e);
      t.addEventListener("click", s, !0), this.childrenEventListeners.push([t, s]);
    }), this.$BlockedInputs = [...this.querySelectorAll("input:not(:disabled)")], this.$BlockedInputs.forEach((t) => {
      t.setAttribute("disabled", "true");
    }), clearInterval(this.blockChildrenTimeout), this.blockChildrenTimeout = void 0;
  }
  childclick(t) {
    t.preventDefault(), t.stopPropagation(), this.click();
  }
  inertialmove() {
    var t = 0, s = 0;
    this.direction != "y" && (t = (this.previousTouchX[2] - this.previousTouchX[0]) / (this.previousTouchTime[2] - this.previousTouchTime[0]) * 1e3 / this.getBoundingClientRect().width), this.direction != "x" && (s = (this.previousTouchY[2] - this.previousTouchY[0]) / (this.previousTouchTime[2] - this.previousTouchTime[0]) * 1e3 / this.getBoundingClientRect().height);
    var e = this.direction == "xy" ? Math.sqrt(t * t + s * s) : this.direction == "y" ? Math.abs(s) : Math.abs(t), h = [t / e, s / e];
    e = Math.min(12, Math.max(-12, 1.2 * e));
    var i = (Date.now() - this.previousTouchTime[2]) / 1e3;
    if (e == 0 || e - 14.278 * i + 75.24 * i * i / e - 149.72 * i * i * i / e / e <= 0 || isNaN(e))
      clearInterval(this.inertialTimerInterval), this.inertialTimerInterval = void 0, this.dispatchEvent(new Event("scrollend"));
    else {
      var u = this.getBoundingClientRect().width * h[0] * (e * i - 7.1397 * i * i + 25.08 * i * i * i / e - 37.43 * i * i * i * i / e / e), a = this.getBoundingClientRect().height * h[1] * (e * i - 7.1397 * i * i + 25.08 * i * i * i / e - 37.43 * i * i * i * i / e / e);
      let c = [this.scrollWidth - this.getBoundingClientRect().width, this.scrollHeight - this.getBoundingClientRect().height], n = [Math.min(c[0], Math.max(0, this.scrollAtT0[0] - u)), Math.min(c[1], Math.max(0, this.scrollAtT0[1] - a))];
      n[0] != 0 && n[0] != c[0] || n[1] != 0 && n[1] != c[1] || (clearInterval(this.inertialTimerInterval), this.inertialTimerInterval = void 0), this.direction != "y" && (this.scrollLeft = n[0]), this.direction != "x" && (this.scrollTop = n[1]), this.dispatchEvent(new Event("scroll"));
    }
  }
  handleScroll() {
    this.addEventListener("customscroll", (t) => {
      if (t instanceof CustomEvent) {
        t.preventDefault(), t.stopPropagation();
        const s = t.detail.axis, e = t.detail.amount, h = t.detail.behavior;
        s === "x" && this.applyScroll([e, 0], h), s === "y" && this.applyScroll([0, e], h);
      }
    }), this.querySelectorAll("*[data-scroll-axis]").forEach((t) => t.addEventListener("click", (s) => {
      var a, c, n, v;
      s.preventDefault(), s.stopPropagation();
      const e = s.target, h = (a = e == null ? void 0 : e.dataset) == null ? void 0 : a.scrollAxis, i = parseFloat(((c = e == null ? void 0 : e.dataset) == null ? void 0 : c.scrollAmount) ?? "0"), u = (n = e == null ? void 0 : e.dataset) == null ? void 0 : n.scrollBehavior;
      ["x", "y"].includes(h ?? "") && ((v = s.target) == null || v.dispatchEvent(new CustomEvent("customscroll", { bubbles: !0, detail: { axis: h, amount: i, behavior: u } })));
    }));
  }
  applyScroll([t, s] = [0, 0], e = "smooth") {
    this.scrollTo({ top: this.scrollTop + s, left: this.scrollLeft + t, behavior: e });
  }
}
r(d, "observedAttributes", ["data-direction"]);
customElements.define("mobile-like-scroller", d);
export {
  d as MobileLikeScroller
};
