var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
export var defaultClassName = ['mapboxgl-popup'];
var Popup = (function (_super) {
    __extends(Popup, _super);
    function Popup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Popup.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className;
        var props = __assign({}, this.props, { children: undefined });
        var childrenClassName = getClassName(defaultClassName, className);
        return (React.createElement(ProjectedLayer, __assign({}, props, { type: "popup", className: childrenClassName }),
            React.createElement("div", { className: "mapboxgl-popup-tip" }),
            React.createElement("div", { className: "mapboxgl-popup-content" }, children)));
    };
    return Popup;
}(React.Component));
export default Popup;
//# sourceMappingURL=popup.js.map