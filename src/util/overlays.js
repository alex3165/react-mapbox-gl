import { LngLat, Point } from 'mapbox-gl/dist/mapbox-gl.js';
import { PropTypes } from 'react';

export const anchors = [
  'center',
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

const anchorTranslates = {
  center: 'translate(-50%,-50%)',
  top: 'translate(-50%,0)',
  left: 'translate(0,-50%)',
  right: 'translate(-100%,-50%)',
  bottom: 'translate(-50%,-100%)',
  'top-left': 'translate(0,0)',
  'top-right': 'translate(-100%,0)',
  'bottom-left': 'translate(0,-100%)',
  'bottom-right': 'translate(-100%,-100%)',
};

const defaultElement = { offsetWidth: 0, offsetHeight: 0 };

const isPointLike = input => (input instanceof Point || Array.isArray(input));

const projectCoordinates = (map, coordinates) => map.project(LngLat.convert(coordinates));

const calculateAnchor = (map, offsets, position, { offsetHeight, offsetWidth }) => {
  let anchor = null;

  if (position.y + offsets.bottom.y - offsetHeight < 0) {
    anchor = [anchors[1]];
  } else if (position.y + offsets.top.y + offsetHeight > map.transform.height) {
    anchor = [anchors[2]];
  } else {
    anchor = [];
  }

  if (position.x < offsetWidth / 2) {
    anchor.push(anchors[3]);
  } else if (position.x > map.transform.width - offsetWidth / 2) {
    anchor.push(anchors[4]);
  }

  if (anchor.length === 0) {
    anchor = anchors[2];
  } else {
    anchor = anchor.join('-');
  }
  return anchor;
};

const normalizedOffsets = (offset) => {
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
      'bottom-right': new Point(-cornerOffset, -cornerOffset),
    };
  }

  if (isPointLike(offset)) {
    // input specifies a single offset to be applied to all positions
    return anchors.reduce((res, anchor) => {
      const tmp = Object.assign({}, res);
      tmp[anchor] = Point.convert(offset);
      return tmp;
    }, {});
  }

  // input specifies an offset per position
  return anchors.reduce((res, anchor) => {
    const tmp = Object.assign({}, res);
    tmp[anchor] = Point.convert(offset[anchor] || [0, 0]);
    return tmp;
  }, {});
};

export const OverlayPropTypes = {
  anchor: PropTypes.oneOf(anchors),
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.object,
  ]),
};

export const overlayState = (props, map, { offsetWidth, offsetHeight } = defaultElement) => {
  const position = projectCoordinates(map, props.coordinates);
  const offsets = normalizedOffsets(props.offset);
  const anchor = props.anchor
    || calculateAnchor(map, offsets, position, { offsetWidth, offsetHeight });

  return {
    anchor,
    position,
    offset: offsets[anchor],
  };
};

const moveTranslate = point => (
  point ? `translate(${point.x}px,${point.y}px)` : ''
);

export const overlayTransform = (args) => {
  const { anchor, position, offset } = args;
  const res = [moveTranslate(position)];

  if (offset && offset.x && offset.y) {
    res.push(moveTranslate(offset));
  }

  if (anchor) {
    res.push(anchorTranslates[anchor]);
  }

  return res;
};
