"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var projected_layer_1 = require("./projected-layer");
var classname_1 = require("./util/classname");
var defaultClassName = ['mapboxgl-marker'];
exports.Marker = function (props) { return (React.createElement(projected_layer_1.default, __assign({}, __assign({}, props), { type: "marker", className: classname_1.getClassName(defaultClassName, props.className) }))); };
exports.default = exports.Marker;
//# sourceMappingURL=marker.js.map