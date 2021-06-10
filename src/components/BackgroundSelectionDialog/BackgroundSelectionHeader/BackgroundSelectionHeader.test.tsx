import React from 'react';
import { shallow } from 'enzyme';
import CloseIcon from '../../../icons/CloseIcon';
import BackgroundSelectionHeader from './BackgroundSelectionHeader';

const mockCloseDialog = jest.fn();

describe('The Background Selection Header Component', () => {
  it('should close the selection dialog when "X" is clicked', () => {
    const wrapper = shallow(<BackgroundSelectionHeader onClose={mockCloseDialog} />);
    wrapper
      .find(CloseIcon)
      .parent()
      .simulate('click');
    expect(mockCloseDialog).toHaveBeenCalled();
  });
});
