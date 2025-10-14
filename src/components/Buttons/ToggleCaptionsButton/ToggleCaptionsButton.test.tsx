import React from 'react';
import { shallow } from 'enzyme';
import ToggleCaptionsButton from './ToggleCaptionsButton';
import { useAppState } from '../../../state';
import CaptionsIcon from '../../../icons/CaptionsIcon';
import CaptionsOffIcon from '../../../icons/CaptionsOffIcon';

jest.mock('../../../state');
const mockUseAppState = useAppState as jest.Mock<any>;

describe('the ToggleCaptionsButton component', () => {
  it('should render correctly when captions are enabled', () => {
    const mockSetIsCaptionsEnabled = jest.fn();
    mockUseAppState.mockImplementation(() => ({
      isCaptionsEnabled: true,
      setIsCaptionsEnabled: mockSetIsCaptionsEnabled,
    }));
    const wrapper = shallow(<ToggleCaptionsButton />);
    const button = wrapper.find('[aria-label="Toggle Captions"]');
    expect(button.prop('startIcon')).toEqual(<CaptionsIcon />);
    expect(button.text()).toBe('Hide Captions');
  });

  it('should render correctly when captions are disabled', () => {
    const mockSetIsCaptionsEnabled = jest.fn();
    mockUseAppState.mockImplementation(() => ({
      isCaptionsEnabled: false,
      setIsCaptionsEnabled: mockSetIsCaptionsEnabled,
    }));
    const wrapper = shallow(<ToggleCaptionsButton />);
    const button = wrapper.find('[aria-label="Toggle Captions"]');
    expect(button.prop('startIcon')).toEqual(<CaptionsOffIcon />);
    expect(button.text()).toBe('Show Captions');
  });

  it('should call the correct toggle function when clicked', () => {
    const mockSetIsCaptionsEnabled = jest.fn();
    mockUseAppState.mockImplementation(() => ({
      isCaptionsEnabled: false,
      setIsCaptionsEnabled: mockSetIsCaptionsEnabled,
    }));
    const wrapper = shallow(<ToggleCaptionsButton />);
    const button = wrapper.find('[aria-label="Toggle Captions"]');
    button.simulate('click');
    expect(mockSetIsCaptionsEnabled).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    const mockSetIsCaptionsEnabled = jest.fn();
    mockUseAppState.mockImplementation(() => ({
      isCaptionsEnabled: false,
      setIsCaptionsEnabled: mockSetIsCaptionsEnabled,
    }));
    const wrapper = shallow(<ToggleCaptionsButton disabled={true} />);
    const button = wrapper.find('[aria-label="Toggle Captions"]');
    expect(button.prop('disabled')).toBe(true);
  });

  it('should apply className prop', () => {
    const mockSetIsCaptionsEnabled = jest.fn();
    mockUseAppState.mockImplementation(() => ({
      isCaptionsEnabled: false,
      setIsCaptionsEnabled: mockSetIsCaptionsEnabled,
    }));
    const wrapper = shallow(<ToggleCaptionsButton className="test-class" />);
    const button = wrapper.find('[aria-label="Toggle Captions"]');
    expect(button.prop('className')).toBe('test-class');
  });

  it('should show tooltip when captions are disabled', () => {
    const mockSetIsCaptionsEnabled = jest.fn();
    mockUseAppState.mockImplementation(() => ({
      isCaptionsEnabled: false,
      setIsCaptionsEnabled: mockSetIsCaptionsEnabled,
    }));
    const wrapper = shallow(<ToggleCaptionsButton />);
    const tooltip = wrapper.find('[data-testid="captions-tooltip"]');
    expect(tooltip.prop('title')).toBe('Requires Real-Time Transcriptions to be enabled in the Twilio Console');
  });

  it('should not show tooltip when captions are enabled', () => {
    const mockSetIsCaptionsEnabled = jest.fn();
    mockUseAppState.mockImplementation(() => ({
      isCaptionsEnabled: true,
      setIsCaptionsEnabled: mockSetIsCaptionsEnabled,
    }));
    const wrapper = shallow(<ToggleCaptionsButton />);
    const tooltip = wrapper.find('[data-testid="captions-tooltip"]');
    expect(tooltip.prop('title')).toBe('');
  });
});
