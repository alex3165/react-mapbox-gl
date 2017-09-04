import { LngLat, Point, Map } from 'mapbox-gl';
import { Props } from '../projected-layer';

export type Anchor =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface PointDef {
  x: number;
  y: number;
}

export interface OverlayProps {
  anchor?: Anchor;
  offset?: PointDef;
  position?: PointDef;
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

const isPointLike = (input: Point | any[]): boolean =>
  input instanceof Point || Array.isArray(input);

const projectCoordinates = (map: Map, coordinates: number[]) =>
  map.project(LngLat.convert(coordinates));

const calculateAnchor = (
  map: Map,
  offsets: any,
  position: PointDef,
  { offsetHeight, offsetWidth } = defaultElement
) => {
  let anchor: string[] = [];

  if (position.y + offsets.bottom.y - offsetHeight < 0) {
    anchor = [anchors[1]];
  } else if (
    position.y + offsets.top.y + offsetHeight >
    (map as any).transform.height
  ) {
    anchor = [anchors[2]];
  }

  if (position.x < offsetWidth / 2) {
    anchor.push(anchors[3]);
  } else if (position.x > (map as any).transform.width - offsetWidth / 2) {
    anchor.push(anchors[4]);
  }

  if (anchor.length === 0) {
    return anchors[2];
  }

  return anchor.join('-');
};

const normalizedOffsets = (offset: any): any => {
  if (!offset) {
    return normalizedOffsets(new (Point as any)(0, 0));
  }

  if (typeof offset === 'number') {
    // input specifies a radius from which to calculate offsets at all positions
    const cornerOffset = Math.round(Math.sqrt(0.5 * Math.pow(offset, 2)));
    return {
      center: new (Point as any)(offset, offset),
      top: new (Point as any)(0, offset),
      bottom: new (Point as any)(0, -offset),
      left: new (Point as any)(offset, 0),
      right: new (Point as any)(-offset, 0),
      'top-left': new (Point as any)(cornerOffset, cornerOffset),
      'top-right': new (Point as any)(-cornerOffset, cornerOffset),
      'bottom-left': new (Point as any)(cornerOffset, -cornerOffset),
      'bottom-right': new (Point as any)(-cornerOffset, -cornerOffset)
    };
  }

  if (isPointLike(offset)) {
    // input specifies a single offset to be applied to all positions
    return anchors.reduce((res, anchor) => {
      res[anchor] = (Point as any).convert(offset);
      return res;
    }, {});
  }

  // input specifies an offset per position
  return anchors.reduce((res, anchor) => {
    res[anchor] = (Point as any).convert(offset[anchor] || [0, 0]);
    return res;
  }, {});
};

export const overlayState = (
  props: Props,
  map: Map,
  container: HTMLElement
) => {
  const position = projectCoordinates(map, props.coordinates);
  const offsets = normalizedOffsets(props.offset);
  const anchor =
    props.anchor || calculateAnchor(map, offsets, position as any, container);

  return {
    anchor,
    position,
    offset: offsets[anchor]
  };
};

const moveTranslate = (point: PointDef) =>
  point ? `translate(${point.x.toFixed(0)}px, ${point.y.toFixed(0)}px)` : '';

export const overlayTransform = ({
  anchor,
  position,
  offset
}: OverlayProps) => {
  const res = [moveTranslate(position as any)];

  if (offset && offset.x !== undefined && offset.y !== undefined) {
    res.push(moveTranslate(offset));
  }

  if (anchor) {
    res.push(anchorTranslates[anchor]);
  }

  return res;
};
