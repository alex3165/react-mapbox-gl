import * as React from 'react';
import Image, { Props } from '../image';
import { getMapMock } from '../jest/util';
import { mount } from 'enzyme';
import * as MapboxGl from 'mapbox-gl';

describe('Image', () => {
  it('Should add image on mount', () => {
    const mapMock = getMapMock();
    const onLoaded = jest.fn();
    const onError = jest.fn();

    const imageId = 'image';
    const imageData = {} as Props['data'];
    const imageOptions = {};

    mount(
      <Image
        id={imageId}
        map={(mapMock as unknown) as MapboxGl.Map}
        data={imageData}
        options={imageOptions}
        onError={onError}
        onLoaded={onLoaded}
      />
    );

    expect(mapMock.addImage.mock.calls[0]).toEqual([
      imageId,
      imageData,
      imageOptions
    ]);

    expect(onLoaded).toBeCalled();
    expect(onError).not.toBeCalled();
  });

  it('Should remove image on unmount', () => {
    const mapMock = getMapMock({
      getStyle: jest.fn(() => ({}))
    });
    const onLoaded = jest.fn();
    const onError = jest.fn();

    const imageId = 'image';
    const imageData = {} as Props['data'];
    const imageOptions = {};

    const component = mount(
      <Image
        id={imageId}
        map={(mapMock as unknown) as MapboxGl.Map}
        data={imageData}
        options={imageOptions}
        onError={onError}
        onLoaded={onLoaded}
      />
    );

    expect(mapMock.addImage).toBeCalled();
    expect(onLoaded).toBeCalled();

    component.unmount();
    expect(mapMock.removeImage).toBeCalled();
  });

  it('Should not call removeImage when map styles are undefined', () => {
    const mapMock = getMapMock({
      getStyle: jest.fn(() => undefined)
    });

    const onLoaded = jest.fn();
    const onError = jest.fn();

    const imageId = 'image';
    const imageData = {} as Props['data'];
    const imageOptions = {};

    const component = mount(
      <Image
        id={imageId}
        map={(mapMock as unknown) as MapboxGl.Map}
        data={imageData}
        options={imageOptions}
        onError={onError}
        onLoaded={onLoaded}
      />
    );

    expect(onLoaded).toBeCalled();

    component.unmount();
    expect(mapMock.removeImage).not.toBeCalled();
  });
});
