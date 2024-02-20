export class EventHandlerClass {
  functionMap: { [key: string]: EventListener };
  constructor() {
    this.functionMap = {};
  }

  addEventListener(event: string, func: EventListener) {
    this.functionMap[event] = func;
    document.addEventListener(event.split('.')[0], this.functionMap[event]);
  }

  removeEventListener(event: string) {
    document.removeEventListener(event.split('.')[0], this.functionMap[event]);
    delete this.functionMap[event];
  }

  removeAllEventListeners() {
    for (const event in this.functionMap) {
      document.removeEventListener(event.split('.')[0], this.functionMap[event]);
      delete this.functionMap[event];
    }
  }
}