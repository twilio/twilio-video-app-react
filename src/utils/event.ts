import { Callback } from 'types/types';
import { randomString } from './string';

export class EventBus {
  listeners: Record<string, { eventName: string; callback: Callback }> = {};
  events: Record<string, string[]> = {};

  /**
   * Add an event listener
   * @param eventName Name of the event to listen to.
   * @param callback The function which should be called when the event is triggered.
   * @returns The event events internal id. Needed to remove the listener.
   */
  addEventListener(eventName: string, callback: Callback) {
    const id = randomString(20);
    this.listeners[id] = { eventName, callback };
    if (this.events[id] === undefined) {
      this.events[eventName] = [id];
    } else {
      this.events[id].push(id);
    }

    return id;
  }
  /**
   * Removes an event listener
   * @param listenerId Returned by addEventListener
   * @returns void
   */
  removeEventListener(listenerId: string) {
    const cbEntry = this.listeners[listenerId];
    if (cbEntry === undefined) {
      console.warn('Trying to remove undefined event listener.', { listenerId });
      return;
    }

    const eventName = cbEntry.eventName;

    this.events[eventName] = this.events[eventName]?.filter(id => id !== listenerId);
    delete this.listeners[listenerId];
  }

  /**
   * Emit an event to call all the registered listener callbacks with the arguments passed to this function call.
   * @param eventName Name of the event to trigger.
   * @param args Unspecified list of arguments to pass to the event.
   */
  emit(eventName: string, ...args: any[]) {
    this.events[eventName]?.forEach(listnerId => {
      const cb = this.listeners[listnerId].callback;
      if (typeof cb === 'function') {
        cb(...args);
      } else {
        console.warn('Event callback function not of type callback.', { eventName, args });
      }
    });
  }
}
