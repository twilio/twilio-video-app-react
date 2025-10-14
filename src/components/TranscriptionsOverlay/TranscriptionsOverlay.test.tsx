import React from 'react';
import { shallow } from 'enzyme';
import TranscriptionsOverlay, { TranscriptionLine } from './TranscriptionsOverlay';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useTranscriptions } from '../../hooks/useTranscriptions/useTranscriptions';

jest.mock('../../state');
jest.mock('../../hooks/useVideoContext/useVideoContext');
jest.mock('../../hooks/useTranscriptions/useTranscriptions');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseTranscriptions = useTranscriptions as jest.Mock<any>;

describe('the TranscriptionsOverlay component', () => {
  const mockLines: TranscriptionLine[] = [
    { text: 'Hello world', participant: 'PA..1234', time: 1000 },
    { text: 'How are you?', participant: 'PA..5678', time: 2000 },
  ];

  const mockRoom = { state: 'connected' };

  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));
  });

  it('should not render when captions are disabled', () => {
    mockUseAppState.mockImplementation(() => ({ isCaptionsEnabled: false }));
    mockUseTranscriptions.mockImplementation(() => ({ lines: mockLines, live: null }));
    const wrapper = shallow(<TranscriptionsOverlay />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('should not render when not connected to room', () => {
    mockUseAppState.mockImplementation(() => ({ isCaptionsEnabled: true }));
    mockUseVideoContext.mockImplementationOnce(() => ({ room: null }));
    mockUseTranscriptions.mockImplementation(() => ({ lines: mockLines, live: null }));
    const wrapper = shallow(<TranscriptionsOverlay />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('should not render when no content available', () => {
    mockUseAppState.mockImplementation(() => ({ isCaptionsEnabled: true }));
    mockUseTranscriptions.mockImplementation(() => ({ lines: [], live: null }));
    const wrapper = shallow(<TranscriptionsOverlay />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('should render when captions enabled and content available', () => {
    mockUseAppState.mockImplementation(() => ({ isCaptionsEnabled: true }));
    mockUseTranscriptions.mockImplementation(() => ({ lines: mockLines, live: null }));
    const wrapper = shallow(<TranscriptionsOverlay />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[role="region"]')).toHaveLength(1);
  });

  it('should render all provided lines', () => {
    mockUseAppState.mockImplementation(() => ({ isCaptionsEnabled: true }));
    mockUseTranscriptions.mockImplementation(() => ({ lines: mockLines, live: null }));
    const wrapper = shallow(<TranscriptionsOverlay />);
    expect(wrapper.text()).toContain('PA..1234:');
    expect(wrapper.text()).toContain('Hello world');
    expect(wrapper.text()).toContain('PA..5678:');
    expect(wrapper.text()).toContain('How are you?');
  });

  it('should render live partial line when provided', () => {
    const mockLive = { text: 'In progress...', participant: 'PA..9999' };
    mockUseAppState.mockImplementation(() => ({ isCaptionsEnabled: true }));
    mockUseTranscriptions.mockImplementation(() => ({ lines: mockLines, live: mockLive }));
    const wrapper = shallow(<TranscriptionsOverlay />);
    expect(wrapper.text()).toContain('PA..9999:');
    expect(wrapper.text()).toContain('In progress...');
  });

  it('should not render live line when not provided', () => {
    mockUseAppState.mockImplementation(() => ({ isCaptionsEnabled: true }));
    mockUseTranscriptions.mockImplementation(() => ({ lines: mockLines, live: null }));
    const wrapper = shallow(<TranscriptionsOverlay />);
    expect(wrapper.text()).not.toContain('PA..9999:');
  });

  it('should limit display to last 5 lines', () => {
    const manyLines: TranscriptionLine[] = [
      { text: 'Line 1', participant: 'PA..1111', time: 1000 },
      { text: 'Line 2', participant: 'PA..2222', time: 2000 },
      { text: 'Line 3', participant: 'PA..3333', time: 3000 },
      { text: 'Line 4', participant: 'PA..4444', time: 4000 },
      { text: 'Line 5', participant: 'PA..5555', time: 5000 },
      { text: 'Line 6', participant: 'PA..6666', time: 6000 },
      { text: 'Line 7', participant: 'PA..7777', time: 7000 },
    ];
    mockUseAppState.mockImplementation(() => ({ isCaptionsEnabled: true }));
    mockUseTranscriptions.mockImplementation(() => ({ lines: manyLines, live: null }));
    const wrapper = shallow(<TranscriptionsOverlay />);
    expect(wrapper.text()).not.toContain('Line 1');
    expect(wrapper.text()).not.toContain('Line 2');
    expect(wrapper.text()).toContain('Line 3');
    expect(wrapper.text()).toContain('Line 7');
  });
});
