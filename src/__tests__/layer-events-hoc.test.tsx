import * as React from 'react';
// tslint:disable-next-line:no-submodule-imports
import { mockComponent } from 'react-dom/test-utils';
import layerMouseTouchEvents from '../layer-events-hoc';
import { mount } from 'enzyme';
import { withContext } from 'recompose';
const PropTypes = require('prop-types'); // tslint:disable-line

class MockComponent extends React.Component<any> {
  public render() {
    return <h1>{this.props.id}</h1>;
  }
}

const LayerHOC = layerMouseTouchEvents(MockComponent);

describe('layer-events-hoc', () => {
  let onMock;
  let LayerHOCWithContext;
  beforeEach(() => {
    onMock = jest.fn();
    LayerHOCWithContext = withContext(
      {
        map: PropTypes.object
      },
      () => ({
        map: {
          on: onMock
        }
      })
    )(LayerHOC);
  });

  it('Should default the id if none is passed', () => {
    const res = mount(<LayerHOCWithContext />);
    expect(res.find('h1').text()).toBe('layer-1');
  });

  it('should listen all mouse and touch events', () => {
    const res = mount(<LayerHOCWithContext />);
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
