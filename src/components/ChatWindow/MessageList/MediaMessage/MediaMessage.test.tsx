import React from 'react';
import { Media } from '@twilio/conversations';
import MediaMessage, { formatFileSize } from './MediaMessage';
import { shallow } from 'enzyme';

jest.mock('@material-ui/core/styles/makeStyles', () => () => () => ({}));

describe('the formatFileSize function', () => {
  [
    { bytes: 789, result: '789 bytes' },
    { bytes: 1000, result: '0.98 KB' },
    { bytes: 1234, result: '1.21 KB' },
    { bytes: 67384, result: '65.8 KB' },
    { bytes: 567123, result: '553.83 KB' },
    { bytes: 1000000, result: '976.56 KB' },
    { bytes: 1647987, result: '1.57 MB' },
    { bytes: 23789647, result: '22.69 MB' },
    { bytes: 798234605, result: '761.26 MB' },
    { bytes: 2458769876, result: '2.29 GB' },
  ].forEach(testCase => {
    it(`should format ${testCase.bytes} to "${testCase.result}"`, () => {
      expect(formatFileSize(testCase.bytes)).toBe(testCase.result);
    });
  });
});

describe('the MediaMessage component', () => {
  it('should get the file URL and load it in a new tab when clicked', done => {
    const mockMedia = {
      filename: 'foo.txt',
      size: 123,
      getContentTemporaryUrl: () => Promise.resolve('http://twilio.com/foo.txt'),
    } as Media;

    const mockAnchorElement = document.createElement('a');
    mockAnchorElement.click = jest.fn();
    document.createElement = jest.fn(() => mockAnchorElement);

    const wrapper = shallow(<MediaMessage media={mockMedia} />);
    wrapper.simulate('click');

    setTimeout(() => {
      expect(mockAnchorElement.href).toBe('http://twilio.com/foo.txt');
      expect(mockAnchorElement.target).toBe('_blank');
      expect(mockAnchorElement.rel).toBe('noopener');
      // This extra setTimeout is needed for the iOS workaround
      setTimeout(() => {
        expect(mockAnchorElement.click).toHaveBeenCalled();
      });
      done();
    });
  });
});
