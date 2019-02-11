var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import ProjectedLayer from './projected-layer';
import { getClassName } from './util/classname';
var defaultClassName = ['mapboxgl-marker'];
export var Marker = function (props) { return (React.createElement(ProjectedLayer, __assign({}, __assign({}, props), { type: "marker", className: getClassName(defaultClassName, props.className) }))); };
export default Marker;
//# sourceMappingURL=marker.js.map