import React from 'react';
import AboutDialog from './AboutDialog';
import { render } from '@testing-library/react';
import { useAppState } from '../../state';

jest.mock('twilio-video', () => ({ version: '1.2', isSupported: true }));
jest.mock('../../state');
jest.mock('../../../package.json', () => ({ version: '1.3' }));

const mockUseAppState = useAppState as jest.Mock<any>;
mockUseAppState.mockImplementation(() => ({ roomType: undefined }));

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
    process.env.REACT_APP_VERSION = '1.3';
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('App Version: 1.3')).toBeTruthy();
  });

  it('should not display the room type when it is unknown', () => {
    const { queryByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(queryByText('Room Type:')).not.toBeTruthy();
  });

  it('should display the room type', () => {
    mockUseAppState.mockImplementationOnce(() => ({ roomType: 'group-small' }));
    const { getByText } = render(<AboutDialog open={true} onClose={() => {}} />);
    expect(getByText('Room Type: group-small')).toBeTruthy();
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
