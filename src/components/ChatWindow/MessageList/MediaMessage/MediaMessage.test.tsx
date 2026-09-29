import React from 'react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
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

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

function createMockMedia(overrides: Partial<{ filename: string; size: number; url: string | null }> = {}) {
  const { filename = 'foo.txt', size = 123, url = 'http://twilio.com/foo.txt' } = overrides;

  return ({
    filename,
    size,
    getContentTemporaryUrl: jest.fn(() => Promise.resolve(url)),
  } as unknown) as Media;
}

function stubDownloadApis(options: { fetchOk?: boolean } = {}) {
  const { fetchOk = true } = options;
  const mockAnchorElement = document.createElement('a');
  mockAnchorElement.click = jest.fn();
  mockAnchorElement.target = '';
  mockAnchorElement.rel = '';

  const originalCreateElement = document.createElement.bind(document);

  jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
    if (tagName === 'a') {
      return mockAnchorElement;
    }

    return originalCreateElement(tagName);
  });

  jest.spyOn(global, 'fetch').mockResolvedValue(({
    ok: fetchOk,
    status: fetchOk ? 200 : 403,
    statusText: fetchOk ? 'OK' : 'Forbidden',
    blob: jest.fn(() => Promise.resolve(new Blob(['test file']))),
  } as unknown) as Response);

  // jsdom does not implement these URL methods, so they must be stubbed
  // before Jest can spy on them.
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: jest.fn(() => 'blob:http://localhost/test'),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: jest.fn(),
  });

  return mockAnchorElement;
}

describe('the MediaMessage component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should download the file when clicked instead of opening a new tab', async () => {
    const mockMedia = createMockMedia();
    const mockAnchorElement = stubDownloadApis();
    const wrapper = shallow(<MediaMessage media={mockMedia} />);

    expect(wrapper.text()).toContain('Click to Download');

    wrapper.simulate('click');
    await flushPromises();

    expect(mockMedia.getContentTemporaryUrl).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('http://twilio.com/foo.txt');
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(mockAnchorElement.href).toBe('blob:http://localhost/test');
    expect(mockAnchorElement.download).toBe('foo.txt');
    expect(mockAnchorElement.target).not.toBe('_blank');

    expect(mockAnchorElement.click).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);

    jest.runOnlyPendingTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/test');
  });

  it('should use a fallback filename when the media has no name', async () => {
    const mockMedia = createMockMedia({ filename: '' });
    const mockAnchorElement = stubDownloadApis();
    const wrapper = shallow(<MediaMessage media={mockMedia} />);

    wrapper.simulate('click');
    await flushPromises();

    expect(mockAnchorElement.download).toBe('download');
  });

  it('should not start a download when the media URL is missing', async () => {
    const mockMedia = createMockMedia({ url: null });
    const mockAnchorElement = stubDownloadApis();
    const wrapper = shallow(<MediaMessage media={mockMedia} />);

    wrapper.simulate('click');
    await flushPromises();
    jest.runOnlyPendingTimers();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockAnchorElement.click).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should not start a download when fetching the file fails', async () => {
    const mockMedia = createMockMedia();
    const mockAnchorElement = stubDownloadApis({ fetchOk: false });
    const wrapper = shallow(<MediaMessage media={mockMedia} />);

    wrapper.simulate('click');
    await flushPromises();
    jest.runOnlyPendingTimers();

    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(mockAnchorElement.click).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});
