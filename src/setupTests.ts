import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'isomorphic-fetch';

configure({ adapter: new Adapter() });

// Mocks the Fullscreen API. This is needed for ToggleFullScreenButton.test.tsx.
Object.defineProperty(document, 'fullscreenEnabled', { value: true, writable: true });

class LocalStorage {
  store = {} as { [key: string]: string };

  getItem(key: string) {
    return this.store[key];
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  clear() {
    this.store = {} as { [key: string]: string };
  }
}

Object.defineProperty(window, 'localStorage', { value: new LocalStorage() });
