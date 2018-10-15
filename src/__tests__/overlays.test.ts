jest.mock('mapbox-gl', () => ({
  default: {},
  LngLat: {}
}));

import { overlayTransform, OverlayParams, anchors } from '../util/overlays';

describe('overlayTransform', () => {
  it('Should transform position anchor and offset accordingly', () => {
    const overlayProps: OverlayParams = {
      anchor: anchors[1],
      // tslint:disable-next-line:no-any
      offset: { x: 10, y: 20 } as any,
      // tslint:disable-next-line:no-any
      position: { x: 1000, y: 2000 } as any
    };

    const res = overlayTransform(overlayProps);

    expect(res).toEqual([
      'translate(1000px, 2000px)',
      'translate(10px, 20px)',
      'translate(-50%, 0)'
    ]);
  });

  it('Should transform position and offset only', () => {
    // tslint:disable-next-line:no-any
    const overlayProps: any = {
      offset: { x: 10, y: 20 },
      position: { x: 1000, y: 2000 }
    };

    const res = overlayTransform(overlayProps);

    expect(res).toEqual(['translate(1000px, 2000px)', 'translate(10px, 20px)']);
  });

  it('Should not add an undefined offset', () => {
    // tslint:disable-next-line:no-any
    const overlayProps: any = {
      offset: { x: undefined, y: 20 },
      position: { x: 1000, y: 2000 }
    };

    const res = overlayTransform(overlayProps);

    expect(res).toEqual(['translate(1000px, 2000px)']);
  });

  it('Should add offset of 0', () => {
    // tslint:disable-next-line:no-any
    const overlayProps: any = {
      offset: { x: 0, y: 20 },
      position: { x: 1000, y: 2000 }
    };

    const res = overlayTransform(overlayProps);

    expect(res).toEqual(['translate(1000px, 2000px)', 'translate(0px, 20px)']);
  });
});
