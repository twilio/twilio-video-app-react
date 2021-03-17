import React from 'react';
import { Media } from '@twilio/conversations/lib/media';
import MediaMessage, { formatFileSize } from './MediaMessage';
import { shallow } from 'enzyme';

jest.mock('@material-ui/core/styles/makeStyles', () => () => () => ({}));

describe('the formatFileSize function', () => {
  [
    { bytes: 789, result: '789 bytes' },
    { bytes: 1234, result: '1.23 KB' },
    { bytes: 67384, result: '67.38 KB' },
    { bytes: 567123, result: '567.12 KB' },
    { bytes: 1647987, result: '1.65 MB' },
    { bytes: 23789647, result: '23.79 MB' },
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
      expect(mockAnchorElement.download).toBe('foo.txt');
      expect(mockAnchorElement.target).toBe('_blank');
      expect(mockAnchorElement.rel).toBe('noopener');
      expect(mockAnchorElement.click).toHaveBeenCalled();
      done();
    });
  });
});
