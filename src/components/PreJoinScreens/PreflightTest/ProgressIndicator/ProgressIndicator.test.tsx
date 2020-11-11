import React from 'react';
import renderer from 'react-test-renderer';
import ProgressIndicator from './ProgressIndicator';

describe('the ProgressIndicator component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<ProgressIndicator />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
