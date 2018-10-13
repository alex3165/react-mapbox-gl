import { LngLat, Point, Map } from 'mapbox-gl';
import { Props } from '../projected-layer';
import { Anchor, AnchorsOffset } from './types';

export interface PointDef {
  x: number;
  y: number;
}

export interface OverlayParams {
  anchor?: Anchor;
  offset?: Point;
  position?: Point;
}

export const anchors = [
  'center',
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right'
] as Anchor[];

export const anchorTranslates = {
  center: 'translate(-50%, -50%)',
  top: 'translate(-50%, 0)',
  left: 'translate(0, -50%)',
  right: 'translate(-100%, -50%)',
  bottom: 'translate(-50%, -100%)',
  'top-left': 'translate(0, 0)',
  'top-right': 'translate(-100%, 0)',
  'bottom-left': 'translate(0, -100%)',
  'bottom-right': 'translate(-100%, -100%)'
};

// Hack /o\
const defaultElement = { offsetWidth: 0, offsetHeight: 0 };
const defaultPoint = [0, 0];

const projectCoordinates = (map: Map, coordinates: [number, number]) =>
  map.project(LngLat.convert(coordinates));

const calculateAnchor = (
  map: Map,
  offsets: AnchorsOffset,
  position: PointDef,
  { offsetHeight, offsetWidth } = defaultElement
) => {
  let anchor: string[] = [];

  if (position.y + offsets.bottom.y - offsetHeight < 0) {
    anchor = [anchors[1]];
  } else if (
    position.y + offsets.top.y + offsetHeight >
    // tslint:disable-next-line:no-any
    (map as any).transform.height
  ) {
    anchor = [anchors[2]];
  }

  if (position.x < offsetWidth / 2) {
    anchor.push(anchors[3]);
    // tslint:disable-next-line:no-any
  } else if (position.x > (map as any).transform.width - offsetWidth / 2) {
    anchor.push(anchors[4]);
  }

  if (anchor.length === 0) {
    return anchors[2];
  }

  return anchor.join('-') as Anchor;
};

const normalizedOffsets = (
  offset?: number | Point | AnchorsOffset | [number, number]
): AnchorsOffset => {
  if (!offset) {
    return normalizedOffsets(new Point(0, 0));
  }

  if (typeof offset === 'number') {
    // input specifies a radius from which to calculate offsets at all positions
    const cornerOffset = Math.round(Math.sqrt(0.5 * Math.pow(offset, 2)));
    return {
      center: new Point(offset, offset),
      top: new Point(0, offset),
      bottom: new Point(0, -offset),
      left: new Point(offset, 0),
      right: new Point(-offset, 0),
      'top-left': new Point(cornerOffset, cornerOffset),
      'top-right': new Point(-cornerOffset, cornerOffset),
      'bottom-left': new Point(cornerOffset, -cornerOffset),
      'bottom-right': new Point(-cornerOffset, -cornerOffset)
    };
  }

  if (offset instanceof Point || Array.isArray(offset)) {
    // input specifies a single offset to be applied to all positions
    return anchors.reduce(
      (res, anchor) => {
        res[anchor] = Point.convert(offset);
        return res;
      },
      // tslint:disable-next-line:no-object-literal-type-assertion
      {} as AnchorsOffset
    );
  }

  // input specifies an offset per position
  return anchors.reduce(
    (res, anchor) => {
      res[anchor] = Point.convert(offset[anchor] || defaultPoint);
      return res;
    },
    // tslint:disable-next-line:no-object-literal-type-assertion
    {} as AnchorsOffset
  );
};

export const overlayState = (
  props: Props,
  map: Map,
  container: HTMLElement
) => {
  const position = projectCoordinates(map, props.coordinates);
  const offsets = normalizedOffsets(props.offset);
  const anchor =
    props.anchor || calculateAnchor(map, offsets, position, container);

  return {
    anchor,
    position,
    offset: offsets[anchor]
  };
};

const moveTranslate = (point: Point) =>
  point ? `translate(${point.x.toFixed(0)}px, ${point.y.toFixed(0)}px)` : '';

export const overlayTransform = ({
  anchor,
  position,
  offset
}: OverlayParams) => {
  const res = [];

  if (position) {
    res.push(moveTranslate(position));
  }

  if (offset && offset.x !== undefined && offset.y !== undefined) {
    res.push(moveTranslate(offset));
  }

  if (anchor) {
    res.push(anchorTranslates[anchor]);
  }

  return res;
};
