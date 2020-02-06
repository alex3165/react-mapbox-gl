import * as React from 'react';
import Image from '../image';
import { getMapMock } from '../jest/util';
import { mount } from 'enzyme';

describe('Image', () => {
  it('Should add image on mount', () => {
    const mapMock = getMapMock();
    const onLoaded = jest.fn();
    const onError = jest.fn();

    const imageId = 'image';
    const imageData = {};
    const imageOptions = {};

    mount(
      <Image
        id={imageId}
        map={mapMock}
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
    const imageData = {};
    const imageOptions = {};

    const component = mount(
      <Image
        id={imageId}
        map={mapMock}
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
    const imageData = {};
    const imageOptions = {};

    const component = mount(
      <Image
        id={imageId}
        map={mapMock}
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

  it('Should not add image if image id already exists', () => {
    const imageExists = jest.fn().mockReturnValue(true);
    const updateImage = jest.fn();

    const mapMock = getMapMock({ hasImage: imageExists, updateImage });
    const onLoaded = jest.fn();
    const onError = jest.fn();

    const imageId = 'image';
    const imageData = {};
    const imageOptions = {};

    mount(
      <Image
        id={imageId}
        map={mapMock}
        data={imageData}
        options={imageOptions}
        onError={onError}
        onLoaded={onLoaded}
      />
    );

    expect(mapMock.hasImage).toBeCalled();
    expect(mapMock.addImage).not.toBeCalled();

    expect(onLoaded).toBeCalled();
    expect(onError).not.toBeCalled();
  });

  it('Should update image if image id does exist', () => {
    const imageExists = jest.fn().mockReturnValue(true);
    const updateImage = jest.fn();

    const mapMock = getMapMock({ hasImage: imageExists, updateImage });
    const onLoaded = jest.fn();
    const onError = jest.fn();

    const imageId = 'image';
    const imageData = {};
    const imageOptions = {};

    mount(
      <Image
        id={imageId}
        map={mapMock}
        data={imageData}
        options={imageOptions}
        onError={onError}
        onLoaded={onLoaded}
      />
    );

    expect(mapMock.hasImage).toBeCalled();
    expect(mapMock.addImage).not.toBeCalled();
    expect(updateImage).toBeCalled();

    expect(onLoaded).toBeCalled();
    expect(onError).not.toBeCalled();
  });

  it('Should add image if image id does not exist', () => {
    const imageDoesNotExist = jest.fn().mockReturnValue(false);

    const mapMock = getMapMock({ hasImage: imageDoesNotExist });
    const onLoaded = jest.fn();
    const onError = jest.fn();

    const imageId = 'image';
    const imageData = {};
    const imageOptions = {};

    mount(
      <Image
        id={imageId}
        map={mapMock}
        data={imageData}
        options={imageOptions}
        onError={onError}
        onLoaded={onLoaded}
      />
    );

    expect(mapMock.hasImage).toBeCalled();
    expect(mapMock.addImage).toBeCalled();

    expect(onLoaded).toBeCalled();
    expect(onError).not.toBeCalled();
  });
});
