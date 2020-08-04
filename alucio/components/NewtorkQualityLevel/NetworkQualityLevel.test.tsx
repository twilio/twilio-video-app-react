import React from 'react';
import renderer from 'react-test-renderer';
import NetworkQualityLevel from './NetworkQualityLevel';

describe('the NetworkQualityLevel component', () => {
  it('should render correctly for level 5', () => {
    const tree = renderer.create(<NetworkQualityLevel qualityLevel={5} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly for level 3', () => {
    const tree = renderer.create(<NetworkQualityLevel qualityLevel={3} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly for level 0', () => {
    const tree = renderer.create(<NetworkQualityLevel qualityLevel={0} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
