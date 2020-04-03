import React from 'react';
import { shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import useFullScreenToggle from '../../../hooks/useFullScreenToggle/useFullScreenToggle';

import ToggleFullscreenButton from './ToggleFullScreenButton';

jest.mock('../../../hooks/useFullScreenToggle/useFullScreenToggle');
const mockeduseFullScreenToggle = useFullScreenToggle as jest.Mock;

describe('Full screen button', () => {
  const toggleFullScreen = jest.fn();

  it('should call toggleFullScreen when Toggle FullScreen button is clicked', () => {
    mockeduseFullScreenToggle.mockImplementation(() => [false, toggleFullScreen]);
    const { getByRole } = render(<ToggleFullscreenButton />);
    fireEvent.click(getByRole('button'));
    expect(toggleFullScreen).toHaveBeenCalled();
  });

  it('should render FullscreenExitIcon when the page is in full screen mode', () => {
    mockeduseFullScreenToggle.mockImplementation(() => [true, toggleFullScreen]);
    const wrapper = shallow(<ToggleFullscreenButton />);
    expect(wrapper.find('FullscreenExitIcon').exists()).toBe(true);
  });

  it('should render FullscreenIcon when the page is not in full screen mode', () => {
    mockeduseFullScreenToggle.mockImplementation(() => [false, toggleFullScreen]);
    const wrapper = shallow(<ToggleFullscreenButton />);
    expect(wrapper.find('FullscreenIcon').exists()).toBe(true);
  });
});
