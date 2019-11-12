import React from 'react';
import { shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import useFullScreenToggler from '../../hooks/useFullScreenToggler/useFullScreenToggler';

import ToggleFullscreenButton from './ToggleFullScreenButton';

jest.mock('../../hooks/useFullScreenToggler/useFullScreenToggler');
const mockedUseFullScreenToggler = useFullScreenToggler as jest.Mock;

describe('Full screen button', () => {
  const toggleFullScreen = jest.fn();

  it('should call toggleFullScreen when Toggle FullScreen button is clicked', () => {
    mockedUseFullScreenToggler.mockImplementation(() => [false, toggleFullScreen]);
    const { getByRole } = render(<ToggleFullscreenButton />);
    fireEvent.click(getByRole('button'));
    expect(toggleFullScreen).toHaveBeenCalled();
  });

  it('should render FullscreenExitIcon when the page is in full screen mode', () => {
    mockedUseFullScreenToggler.mockImplementation(() => [true, toggleFullScreen]);
    const wrapper = shallow(<ToggleFullscreenButton />);
    expect(wrapper.find('FullscreenExitIcon').exists()).toBe(true);
  });

  it('should render FullscreenIcon when the page is not in full screen mode', () => {
    mockedUseFullScreenToggler.mockImplementation(() => [false, toggleFullScreen]);
    const wrapper = shallow(<ToggleFullscreenButton />);
    expect(wrapper.find('FullscreenIcon').exists()).toBe(true);
  });
});
