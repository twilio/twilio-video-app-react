import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// @ts-ignore
document.fullscreenEnabled = true;
configure({ adapter: new Adapter() });
