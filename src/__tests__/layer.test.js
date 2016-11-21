import React from 'react';
import Layer from '../layer';
import TestUtils from 'react-addons-test-utils';
import { withContext } from 'recompose';

describe('Layer', () => {
  let LayerWithContext;

  beforeAll(() => {
    LayerWithContext = withContext({
      map: React.PropTypes.object
    }, () => ({
      map: {
        addSource: jest.fn(),
        addLayer: jest.fn(),
        on: jest.fn(),
        getSource: jest.fn().mockReturnValue({ setData: jest.fn() })
      }
    }))(Layer);
  });

  it('Should render layer', () => {
    const LayerComponent = TestUtils.renderIntoDocument(
      <LayerWithContext
        children={[{ props: {}}]}/>
    );

    // console.log(LayerComponent);

    // expect(LayerComponent).toMatchSnapshot();
  });
});
