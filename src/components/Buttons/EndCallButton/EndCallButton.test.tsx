import React from 'react';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';

const mockVideoContext = {
  room: {
    disconnect: jest.fn(),
  },
  isSharingScreen: false,
  toggleScreenShare: jest.fn(),
  removeLocalAudioTrack: jest.fn(),
  removeLocalVideoTrack: jest.fn(),
};

jest.mock('../../../hooks/useVideoContext/useVideoContext', () => () => mockVideoContext);

describe('End Call button', () => {
  describe('when it is clicked', () => {
    describe('while sharing screen', () => {
      let wrapper;

      beforeAll(() => {
        jest.clearAllMocks();
        mockVideoContext.isSharingScreen = true;
        wrapper = shallow(<EndCallButton />);
        wrapper.simulate('click');
      });

      it('should stop local audio tracks', () => {
        expect(mockVideoContext.removeLocalAudioTrack).toHaveBeenCalled();
      });

      it('should stop local video tracks', () => {
        expect(mockVideoContext.removeLocalVideoTrack).toHaveBeenCalled();
      });

      it('should toggle screen sharing off', () => {
        expect(mockVideoContext.toggleScreenShare).toHaveBeenCalled();
      });

      it('should disconnect from the room ', () => {
        expect(mockVideoContext.room.disconnect).toHaveBeenCalled();
      });
    });

    describe('while not sharing screen', () => {
      let wrapper;

      beforeAll(() => {
        jest.clearAllMocks();
        mockVideoContext.isSharingScreen = false;
        wrapper = shallow(<EndCallButton />);
        wrapper.simulate('click');
      });

      it('should not toggle screen sharing', () => {
        expect(mockVideoContext.toggleScreenShare).not.toHaveBeenCalled();
      });
    });
  });
});
