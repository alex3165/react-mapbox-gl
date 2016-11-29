/* eslint quote-props: 0 */
/* eslint dot-notation: 0 */
/* eslint no-else-return: 0 */

import { LngLat, Point } from 'mapbox-gl/dist/mapbox-gl.js';
import { PropTypes } from 'react';

const anchors = [
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

export const OverlayPropTypes = {
  anchor: PropTypes.oneOf(anchors),
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.object,
  ]),
};

const projectCoordinates = (map, coordinates) =>
  map.project(LngLat.convert(coordinates));

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

const isPointLike = input =>
  input instanceof Point || Array.isArray(input);

const normalizedOffsets = (offset) => {
  if (!offset) {
    return normalizedOffsets(new Point(0, 0));
  } else if (typeof offset === 'number') {
    // input specifies a radius from which to calculate offsets at all positions
    const cornerOffset = Math.round(Math.sqrt(0.5 * Math.pow(offset, 2)));
    return {
      'center': new Point(offset, offset),
      'top': new Point(0, offset),
      'top-left': new Point(cornerOffset, cornerOffset),
      'top-right': new Point(-cornerOffset, cornerOffset),
      'bottom': new Point(0, -offset),
      'bottom-left': new Point(cornerOffset, -cornerOffset),
      'bottom-right': new Point(-cornerOffset, -cornerOffset),
      'left': new Point(offset, 0),
      'right': new Point(-offset, 0),
    };
  } else if (isPointLike(offset)) {
    // input specifies a single offset to be applied to all positions
    return anchors.reduce((res, anchor) => {
      res[anchor] = Point.convert(offset);
      return res;
    });

  } else {
    // input specifies an offset per position
    return anchors.reduce((res, anchor) => {
      res[anchor] = Point.convert(offset[anchor] || [0, 0]);
      return res;
    });
  }
};

export const overlayState = (props, context, element = {}) => {
  const { offsetWidth = 0, offsetHeight = 0 } = element;
  const position = projectCoordinates(context.map, props.coordinates);
  const offsets = normalizedOffsets(props.offset);
  const anchor = props.anchor
    || calculateAnchor(context.map, offsets, position, { offsetWidth, offsetHeight });

  return {
    anchor,
    position,
    offset: offsets[anchor],
  };
};

const anchorTranslate = (anchor) => {
  const anchorTranslates = {
    'center': 'translate(-50%,-50%)',
    'top': 'translate(-50%,0)',
    'top-left': 'translate(0,0)',
    'top-right': 'translate(-100%,0)',
    'bottom': 'translate(-50%,-100%)',
    'bottom-left': 'translate(0,-100%)',
    'bottom-right': 'translate(-100%,-100%)',
    'left': 'translate(0,-50%)',
    'right': 'translate(-100%,-50%)',
  };
  return anchorTranslates[anchor] || '';
};

const moveTranslate = point => (
  point ? `translate(${point.x}px,${point.y}px)` : ''
);

export const overlayTransform = (state) => {
  const { anchor, position, offset } = state;
  return `${anchorTranslate(anchor)} ${moveTranslate(position)} ${moveTranslate(offset)}`;
};
