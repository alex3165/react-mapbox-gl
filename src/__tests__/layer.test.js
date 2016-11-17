import React from 'react';
import Layer from './layer';
import renderer from 'react-test-renderer';

test('Layer', () => {
  const LayerComponent = renderer.create(
    <Layer/>
  );
});
