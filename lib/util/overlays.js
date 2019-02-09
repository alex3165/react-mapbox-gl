"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapbox_gl_1 = require("mapbox-gl");
exports.anchors = [
    'center',
    'top',
    'bottom',
    'left',
    'right',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
];
exports.anchorTranslates = {
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
var defaultElement = { offsetWidth: 0, offsetHeight: 0 };
var defaultPoint = [0, 0];
var projectCoordinates = function (map, coordinates) {
    return map.project(mapbox_gl_1.LngLat.convert(coordinates));
};
var calculateAnchor = function (map, offsets, position, _a) {
    var _b = _a === void 0 ? defaultElement : _a, offsetHeight = _b.offsetHeight, offsetWidth = _b.offsetWidth;
    var anchor = [];
    if (position.y + offsets.bottom.y - offsetHeight < 0) {
        anchor = [exports.anchors[1]];
    }
    else if (position.y + offsets.top.y + offsetHeight >
        map.transform.height) {
        anchor = [exports.anchors[2]];
    }
    if (position.x < offsetWidth / 2) {
        anchor.push(exports.anchors[3]);
    }
    else if (position.x > map.transform.width - offsetWidth / 2) {
        anchor.push(exports.anchors[4]);
    }
    if (anchor.length === 0) {
        return exports.anchors[2];
    }
    return anchor.join('-');
};
var normalizedOffsets = function (offset) {
    if (!offset) {
        return normalizedOffsets(new mapbox_gl_1.Point(0, 0));
    }
    if (typeof offset === 'number') {
        var cornerOffset = Math.round(Math.sqrt(0.5 * Math.pow(offset, 2)));
        return {
            center: new mapbox_gl_1.Point(offset, offset),
            top: new mapbox_gl_1.Point(0, offset),
            bottom: new mapbox_gl_1.Point(0, -offset),
            left: new mapbox_gl_1.Point(offset, 0),
            right: new mapbox_gl_1.Point(-offset, 0),
            'top-left': new mapbox_gl_1.Point(cornerOffset, cornerOffset),
            'top-right': new mapbox_gl_1.Point(-cornerOffset, cornerOffset),
            'bottom-left': new mapbox_gl_1.Point(cornerOffset, -cornerOffset),
            'bottom-right': new mapbox_gl_1.Point(-cornerOffset, -cornerOffset)
        };
    }
    if (offset instanceof mapbox_gl_1.Point || Array.isArray(offset)) {
        return exports.anchors.reduce(function (res, anchor) {
            res[anchor] = mapbox_gl_1.Point.convert(offset);
            return res;
        }, {});
    }
    return exports.anchors.reduce(function (res, anchor) {
        res[anchor] = mapbox_gl_1.Point.convert(offset[anchor] || defaultPoint);
        return res;
    }, {});
};
exports.overlayState = function (props, map, container) {
    var position = projectCoordinates(map, props.coordinates);
    var offsets = normalizedOffsets(props.offset);
    var anchor = props.anchor || calculateAnchor(map, offsets, position, container);
    return {
        anchor: anchor,
        position: position,
        offset: offsets[anchor]
    };
};
var moveTranslate = function (point) {
    return point ? "translate(" + point.x.toFixed(0) + "px, " + point.y.toFixed(0) + "px)" : '';
};
exports.overlayTransform = function (_a) {
    var anchor = _a.anchor, position = _a.position, offset = _a.offset;
    var res = [];
    if (position) {
        res.push(moveTranslate(position));
    }
    if (offset && offset.x !== undefined && offset.y !== undefined) {
        res.push(moveTranslate(offset));
    }
    if (anchor) {
        res.push(exports.anchorTranslates[anchor]);
    }
    return res;
};
//# sourceMappingURL=overlays.js.map