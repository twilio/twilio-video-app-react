import React from 'react';
import AboutDialog from './AboutDialog';
import { render } from '@testing-library/react';

jest.mock('twilio-video', () => ({ version: '1.2', isSupported: true }));
jest.mock('../../../../package.json', () => ({ version: '1.3' }));

describe('the AboutDialog component', () => {
  it('should display Video.isSupported', () => {
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('Browser supported: true')).toBeTruthy();
  });

  it('should display the SDK version', () => {
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('SDK Version: 1.2')).toBeTruthy();
  });

  it('should display the package.json version', () => {
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('App Version: 1.3')).toBeTruthy();
  });

  describe('when running locally', () => {
    beforeEach(() => {
      // @ts-ignore
      process.env = {};
    });

    it('should display N/A as the git tag', () => {
      const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
      expect(getByText('Deployed Tag: N/A')).toBeTruthy();
    });

    it('should disaply N/A as the commit hash', () => {
      const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
      expect(getByText('Deployed Commit Hash: N/A')).toBeTruthy();
    });
  });

  describe('when deployed via CircleCI', () => {
    beforeEach(() => {
      // @ts-ignore
      process.env = {
        REACT_APP_GIT_TAG: 'v0.1',
        REACT_APP_GIT_COMMIT: '01b2c3',
      };
    });

    it('should display the git tag', () => {
      const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
      expect(getByText('Deployed Tag: v0.1')).toBeTruthy();
    });

    it('should display the commit hash', () => {
      const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
      expect(getByText('Deployed Commit Hash: 01b2c3')).toBeTruthy();
    });
  });
});
