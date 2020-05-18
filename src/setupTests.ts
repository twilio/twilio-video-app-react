import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'isomorphic-fetch';

configure({ adapter: new Adapter() });

Object.defineProperty(document, 'fullscreenEnabled', { value: true, writable: true });
