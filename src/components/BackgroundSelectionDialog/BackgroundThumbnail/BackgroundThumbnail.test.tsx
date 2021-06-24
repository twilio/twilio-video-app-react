import React from 'react';
import BackgroundThumbnail from './BackgroundThumbnail';
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
  it('should not be selected when thumbnail prop and backgroundSettings type are different', () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'none'} />);
    expect(
      wrapper
        .find('div')
        .children('div')
        .first()
        .prop('className')
    ).toContain('thumb');
  });

  it('should be selected when thumbnail prop and backgroundSettings type are equivalent', () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'blur'} />);
    expect(
      wrapper
        .find('div')
        .children('div')
        .first()
        .prop('className')
    ).toContain('selected');
  });

  it("should contain the NoneIcon when thumbnail is set to 'none'", () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'none'} />);
    expect(
      wrapper
        .find('div')
        .children('NotInterestedOutlinedIcon')
        .exists()
    ).toBe(true);
  });

  it("should contain the BlurIcon when thumbnail is set to 'blur'", () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'blur'} />);
    expect(
      wrapper
        .find('div')
        .children('BlurOnOutlinedIcon')
        .exists()
    ).toBe(true);
  });

  it("should not have any icons when thumbnail is set to 'image'", () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'image'} />);
    expect(
      wrapper
        .find('div')
        .children('BlurOnOutlinedIcon')
        .exists() ||
        wrapper
          .find('div')
          .children('NotInterestedOutlinedIcon')
          .exists()
    ).toBe(false);
  });

  it('Clicking on a thumbnail updates the background settings', () => {
    const wrapper = shallow(<BackgroundThumbnail thumbnail={'none'} />);
    wrapper.simulate('click');
    expect(mockSetBackgroundSettings).toHaveBeenCalled();
  });
});
