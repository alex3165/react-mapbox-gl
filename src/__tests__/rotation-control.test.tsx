import * as React from 'react';
import RotationControl from '../rotation-control';
import { mountWithMap, getMapMock } from '../jest/util';

describe('RotationControl', () => {
  it('should render the component', () => {
    const wrapper = mountWithMap(<RotationControl />, getMapMock());
    expect(wrapper).toBeDefined();
  });
});
