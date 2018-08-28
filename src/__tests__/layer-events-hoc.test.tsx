import React from 'react';
// tslint:disable-next-line:no-submodule-imports
import { MapProvider } from '../map-context';
import layerMouseTouchEvents from '../layer-events-hoc';
import { mount } from 'enzyme';

class MockComponent extends React.Component<{ id: string }> {
  public render() {
    return <h1>{this.props.id}</h1>;
  }
}

const LayerHOC = layerMouseTouchEvents(MockComponent);

describe('layer-events-hoc', () => {
  let onMock;
  // tslint:disable-next-line:no-any
  let map: any;
  beforeEach(() => {
    onMock = jest.fn();
    map = {
      on: onMock
    };
  });

  it('Should default the id if none is passed', () => {
    const res = mount(
      <MapProvider map={map}>
        <LayerHOC />
      </MapProvider>
    );
    expect(res.find('h1').text()).toBe('layer-1');
  });

  it('should listen all mouse and touch events', () => {
    const res = mount(
      <MapProvider map={map}>
        <LayerHOC />
      </MapProvider>
    );
    const events = [
      'click',
      'mouseenter',
      'mouseleave',
      'mousedown',
      'touchstart'
    ];

    expect(onMock.mock.calls.map(call => call[0])).toEqual(events);
  });
});
