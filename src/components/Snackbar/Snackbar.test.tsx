import { shallow } from 'enzyme';
import React from 'react';
import Snackbar from './Snackbar';

describe('the Snackbar component', () => {
  it('should render correctly with "warning" variant', () => {
    const wrapper = shallow(
      <Snackbar variant="warning" headline="Test Headline" message="Test Message" handleClose={() => {}} open={true} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with "error" variant', () => {
    const wrapper = shallow(
      <Snackbar variant="error" headline="Test Headline" message="Test Message" handleClose={() => {}} open={true} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with "info" variant', () => {
    const wrapper = shallow(
      <Snackbar variant="info" headline="Test Headline" message="Test Message" handleClose={() => {}} open={true} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no handleClose function provided', () => {
    const wrapper = shallow(<Snackbar variant="error" headline="Test Headline" message="Test Message" open={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('the handleClose function', () => {
    beforeEach(jest.clearAllMocks);

    const mockHandleClose = jest.fn();
    const wrapper = shallow(
      <Snackbar
        variant="warning"
        headline="Test Headline"
        message="Test Message"
        handleClose={mockHandleClose}
        open={true}
      />
    );

    it('should be called when the onClose function is called', () => {
      wrapper.prop('onClose')();
      expect(mockHandleClose).toHaveBeenCalled();
    });

    it('should be called when the onClose function is called with the "clickaway" reason', () => {
      wrapper.prop('onClose')({}, 'clickaway');
      expect(mockHandleClose).not.toHaveBeenCalled();
    });
  });
});
