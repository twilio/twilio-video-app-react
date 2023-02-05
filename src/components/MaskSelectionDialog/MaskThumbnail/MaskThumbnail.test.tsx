import React from 'react';
import MaskThumbnail from './MaskThumbnail';
import BlurIcon from '@material-ui/icons/BlurOnOutlined';
import NoneIcon from '@material-ui/icons/NotInterestedOutlined';
import { shallow } from 'enzyme';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

jest.mock('../../../hooks/useVideoContext/useVideoContext');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockSetMaskSettings = jest.fn();
mockUseVideoContext.mockImplementation(() => ({
  maskSettings: {
    type: 'blur',
    index: 0,
  },
  setMaskSettings: mockSetMaskSettings,
}));

describe('The MaskThumbnail component', () => {
  it('should update the mask settings when clicked', () => {
    const wrapper = shallow(<MaskThumbnail thumbnail={'none'} index={5} />);
    wrapper.simulate('click');
    expect(mockSetMaskSettings).toHaveBeenCalledWith({ index: 5, type: 'none' });
  });

  it('should not be selected when thumbnail prop and maskSettings type are not equivalent (icon)', () => {
    const wrapper = shallow(<MaskThumbnail thumbnail={'none'} />);
    expect(wrapper.find('.selected').exists()).toBe(false);
  });

  it('should be selected when thumbnail prop and maskSettings type are equivalent (image)', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({
      maskSettings: {
        type: 'image',
        index: 1,
      },
      setMaskSettings: mockSetMaskSettings,
    }));
    const wrapper = shallow(<MaskThumbnail thumbnail={'image'} index={1} />);
    expect(wrapper.find('.selected').exists()).toBe(true);
  });

  it('should not be selected when thumbnail and maskSettings type are not equivlanet (image)', () => {
    mockUseVideoContext.mockImplementationOnce(() => ({
      maskSettings: {
        type: 'image',
        index: 1,
      },
      setMaskSettings: mockSetMaskSettings,
    }));
    const wrapper = shallow(<MaskThumbnail thumbnail={'image'} index={5} />);
    expect(wrapper.find('.selected').exists()).toBe(false);
  });

  it("should contain the NoneIcon when thumbnail is set to 'none'", () => {
    const wrapper = shallow(<MaskThumbnail thumbnail={'none'} />);
    expect(wrapper.containsMatchingElement(<NoneIcon />)).toBe(true);
  });

  it("should not have any icons when thumbnail is set to 'image'", () => {
    const wrapper = shallow(<MaskThumbnail thumbnail={'image'} />);
    expect(wrapper.containsMatchingElement(<BlurIcon />)).toBe(false);
    expect(wrapper.containsMatchingElement(<NoneIcon />)).toBe(false);
  });
});
