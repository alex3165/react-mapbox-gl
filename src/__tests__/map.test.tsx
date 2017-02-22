let fitBounds = jest.fn();
let on = jest.fn();

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({
    fitBounds,
    on
  })
}));

import * as React from 'react';
import ReactMapboxGl from '../map';
import * as TestUtils from 'react-addons-test-utils';

describe('Map', () => {
  beforeEach(() => {
    fitBounds = jest.fn();
    on = jest.fn();
  });

  it('Should render the map correctly', () => {
    TestUtils.renderIntoDocument(
      <ReactMapboxGl style="" accessToken=""/>
    );
  });

  it('Should call fitBounds with the right parameters', () => {
    const fitBoundsValues = [[0, 1], [2, 3]];
    const fitBoundsOptions = { linear: true };

    TestUtils.renderIntoDocument(
      <ReactMapboxGl style="" accessToken="" fitBounds={fitBoundsValues} fitBoundsOptions={fitBoundsOptions}/>
    );

    expect(fitBounds.mock.calls[0]).toEqual([
      fitBoundsValues,
      fitBoundsOptions
    ]);
  });
});
