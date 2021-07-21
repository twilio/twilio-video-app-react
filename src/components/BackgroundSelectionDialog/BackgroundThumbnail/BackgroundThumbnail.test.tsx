import React from 'react';
import BackgroundThumbnail from './BackgroundThumbnail';
import BlurIcon from '@material-ui/icons/BlurOnOutlined';
import NoneIcon from '@material-ui/icons/NotInterestedOutlined';
import { shallow } from 'enzyme';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

jest.mock('../../../hooks/useVideoContext/useVideoContext');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockSetBackgroundSettings = jest.fn();
mockUseVideoContext.mockImplementation(() => ({
  backgroundSettings: {
    type: 'blur',
    index: 0,
  },
  setBackgroundSettings: mockSetBackgroundSettings,
}));

describe('The BackgroundThumbanil component', () => {
  it('should update the background settings when clicked', () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'none'} index={5} />);
    wrapper.simulate('click');
    expect(mockSetBackgroundSettings).toHaveBeenCalledWith({ index: 5, type: 'none' });
  });

  it('should not be selected when thumbnail prop and backgroundSettings type are not equivalent (icon)', () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'none'} />);
    expect(wrapper.find('.selected').exists()).toBe(false);
  });

  it('should be selected when thumbnail prop and backgroundSettings type are equivalent (icon)', () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'blur'} />);
    expect(wrapper.find('.selected').exists()).toBe(true);
  });

  it('should be selected when thumbnail prop and backgroundSettings type are equivalent (image)', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({
      backgroundSettings: {
        type: 'image',
        index: 1,
      },
      setBackgroundSettings: mockSetBackgroundSettings,
    }));
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'image'} index={1} />);
    expect(wrapper.find('.selected').exists()).toBe(true);
  });

  it('should not be selected when thumbnail and backgroundSettings type are not equivlanet (image)', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({
      backgroundSettings: {
        type: 'image',
        index: 1,
      },
      setBackgroundSettings: mockSetBackgroundSettings,
    }));
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'image'} index={5} />);
    expect(wrapper.find('.selected').exists()).toBe(false);
  });

  it("should contain the NoneIcon when thumbnail is set to 'none'", () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'none'} />);
    expect(wrapper.containsMatchingElement(<NoneIcon />)).toBe(true);
  });

  it("should contain the BlurIcon when thumbnail is set to 'blur'", () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'blur'} />);
    expect(wrapper.containsMatchingElement(<BlurIcon />)).toBe(true);
  });

  it("should not have any icons when thumbnail is set to 'image'", () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'image'} />);
    expect(wrapper.containsMatchingElement(<BlurIcon />)).toBe(false);
    expect(wrapper.containsMatchingElement(<NoneIcon />)).toBe(false);
  });
});
