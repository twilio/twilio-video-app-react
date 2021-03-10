import React from 'react';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';

const mockVideoContext = {
  room: {
    disconnect: jest.fn(),
  },
  isSharingScreen: false,
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
        wrapper = shallow(<EndCallButton />);
        wrapper.simulate('click');
      });

      it('should stop local audio tracks', () => {
        expect(mockVideoContext.removeLocalAudioTrack).toHaveBeenCalled();
      });

      it('should stop local video tracks', () => {
        expect(mockVideoContext.removeLocalVideoTrack).toHaveBeenCalled();
      });

      it('should disconnect from the room ', () => {
        expect(mockVideoContext.room.disconnect).toHaveBeenCalled();
      });
    });
  });
});
