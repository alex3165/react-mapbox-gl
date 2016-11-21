import React from 'react';
import Layer from '../layer';
import renderer from 'react-test-renderer';
import { withContext } from 'recompose';

test('Layer', () => {
  describe('Should test Layer', () => {
    let LayerWithContext;

    beforeAll(() => {
      LayerWithContext = withContext({
        map: React.PropTypes.object
      }, () => ({
        map: {
          addSource: () => null,
          addLayer: () => null,
          on: () => null
        }
      }))(Layer);
    });

    it('Should render layer', () => {
      const LayerComponent = renderer.create(
        <LayerWithContext/>
      );
    });
  });
});
