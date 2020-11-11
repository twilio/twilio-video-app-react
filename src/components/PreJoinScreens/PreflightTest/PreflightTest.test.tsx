import React from 'react';
import getNetworkCondition from './getNetworkCondition/getNetworkCondition';
import PreflightTest, { NetworkCondition, Result } from './PreflightTest';
import ProgressIndicator from './ProgressIndicator/ProgressIndicator';
import { shallow } from 'enzyme';
import useGetPreflightTokens from './useGetPreflightTokens/useGetPreflightTokens';
import usePreflightTest from './usePreflightTest/usePreflightTest';

jest.mock('./useGetPreflightTokens/useGetPreflightTokens');
jest.mock('./usePreflightTest/usePreflightTest');
jest.mock('./getNetworkCondition/getNetworkCondition');

const mockUseGetPreflightTokens = useGetPreflightTokens as jest.Mock<any>;
const mockUsePreflightTest = usePreflightTest as jest.Mock<any>;
const mockGetNetworkCondition = getNetworkCondition as jest.Mock<any>;

mockUseGetPreflightTokens.mockImplementation(() => ({ tokens: ['mockTokenA', 'mockTokenB'], tokenError: undefined }));
mockGetNetworkCondition.mockImplementation(() => NetworkCondition.Green);

describe('the PreflightTest component', () => {
  it('should render correctly when the test is in progress', () => {
    mockUsePreflightTest.mockImplementation(() => ({}));
    const wrapper = shallow(<PreflightTest />);
    expect(wrapper.text()).toContain('Checking your network connection');
    expect(wrapper.find(ProgressIndicator).exists()).toBe(true);
    expect(wrapper.find(Result).exists()).toBe(false);
  });

  it('should render correctly when there is a report', () => {
    mockUsePreflightTest.mockImplementation(() => ({ testReport: 'mockTestReport' }));
    const wrapper = shallow(<PreflightTest />);
    expect(wrapper.find(ProgressIndicator).exists()).toBe(false);
    expect(wrapper.find(Result).exists()).toBe(true);
  });

  it('should render correctly when there is a failure', () => {
    mockUsePreflightTest.mockImplementation(() => ({ testFailure: 'mockTestFailure' }));
    const wrapper = shallow(<PreflightTest />);
    expect(wrapper.find(ProgressIndicator).exists()).toBe(false);
    expect(wrapper.find(Result).exists()).toBe(true);
  });
});

describe('the Result component', () => {
  it('should render correctly when the network condition is green', () => {
    const wrapper = shallow(<Result networkCondition={NetworkCondition.Green} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when the network condition is yellow', () => {
    const wrapper = shallow(<Result networkCondition={NetworkCondition.Yellow} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when the network condition is red', () => {
    const wrapper = shallow(<Result networkCondition={NetworkCondition.Red} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when there is an error', () => {
    const wrapper = shallow(<Result error={new Error()} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render anything when there are no props', () => {
    const wrapper = shallow(<Result />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });
});
