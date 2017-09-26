import * as React from 'react';
import ScaleControl from '../scale-control';
import { shallow } from 'enzyme';
import { withContext } from 'recompose';
const PropTypes = require('prop-types'); // tslint:disable-line

describe('ScaleControl', () => {
  let ScaleControlWithContext: any;

  beforeEach(() => {
    ScaleControlWithContext = withContext(
      {
        map: PropTypes.object
      },
      () => ({
        map: {
          getBounds: {
            _ne: { lng: 0, lat: 0 },
            _sw: { lng: 0, lat: 0 }
          }
        }
      })
    )(ScaleControl);
  });

  it('should render the component', () => {
    const wrapper = shallow(<ScaleControlWithContext />);

    expect(wrapper).toBeDefined();
  });
});
