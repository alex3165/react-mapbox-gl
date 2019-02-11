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
exports.MapContext = React.createContext(undefined);
function withMap(Component) {
    return function MappedComponent(props) {
        return (React.createElement(exports.MapContext.Consumer, null, function (map) { return React.createElement(Component, __assign({ map: map }, props)); }));
    };
}
exports.withMap = withMap;
//# sourceMappingURL=context.js.map