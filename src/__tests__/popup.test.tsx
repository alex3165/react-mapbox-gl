jest.mock('mapbox-gl', () => ({
  Map: {}
}));
jest.mock('../util/overlays', () => ({
  overlayState: jest.fn(() => ({})),
  overlayTransform: jest.fn(() => []),
  anchors: []
}));
import * as React from 'react';
import Popup, { defaultClassName } from '../popup';
import { withContext } from 'recompose';
import { mount } from 'enzyme';
const PropTypes = require('prop-types'); // tslint:disable-line

describe('Popup', () => {
  let PopupWithContext: any;

  beforeEach(() => {
    PopupWithContext = withContext(
      {
        map: PropTypes.object
      },
      () => ({
        map: {
          on: jest.fn()
        }
      })
    )(Popup);
  });

  it('Should render component', () => {
    const wrapper = mount(<PopupWithContext coordinates={[0, 0]} />);

    expect(wrapper).toBeDefined();
  });

  it('Should add custom className', () => {
    const wrapper = mount(
      <PopupWithContext className="custom-classname" coordinates={[0, 0]} />
    );

    expect(wrapper.find('Popup').hasClass('custom-classname')).toEqual(true);
  });

  it('Should concat custom className to defaultClassName', () => {
    const wrapper = mount(
      <PopupWithContext className="custom-classname" coordinates={[0, 0]} />
    );
    expect(
      wrapper
        .find('Popup')
        .childAt(0)
        .hasClass(defaultClassName[0])
    ).toEqual(true);
  });
});
