"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var overlays_1 = require("./util/overlays");
var context_1 = require("./context");
var defaultStyle = {
    zIndex: 3
};
var ProjectedLayer = (function (_super) {
    __extends(ProjectedLayer, _super);
    function ProjectedLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = undefined;
        _this.prevent = false;
        _this.state = {};
        _this.setContainer = function (el) {
            if (el) {
                _this.container = el;
            }
        };
        _this.handleMapMove = function () {
            if (!_this.prevent) {
                _this.setState(overlays_1.overlayState(_this.props, _this.props.map, _this.container));
            }
        };
        return _this;
    }
    ProjectedLayer.prototype.componentDidMount = function () {
        var map = this.props.map;
        map.on('move', this.handleMapMove);
        this.handleMapMove();
    };
    ProjectedLayer.prototype.havePropsChanged = function (props, nextProps) {
        return (props.coordinates[0] !== nextProps.coordinates[0] ||
            props.coordinates[1] !== nextProps.coordinates[1] ||
            props.offset !== nextProps.offset ||
            props.anchor !== nextProps.anchor);
    };
    ProjectedLayer.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.havePropsChanged(this.props, nextProps)) {
            this.setState(overlays_1.overlayState(nextProps, this.props.map, this.container));
        }
    };
    ProjectedLayer.prototype.componentWillUnmount = function () {
        var map = this.props.map;
        this.prevent = true;
        map.off('move', this.handleMapMove);
    };
    ProjectedLayer.prototype.render = function () {
        var _a = this.props, style = _a.style, children = _a.children, className = _a.className, onClick = _a.onClick, onDoubleClick = _a.onDoubleClick, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, onScroll = _a.onScroll, onWheel = _a.onWheel, type = _a.type, tabIndex = _a.tabIndex;
        var anchor = this.state.anchor;
        var finalStyle = __assign({}, defaultStyle, style, { transform: overlays_1.overlayTransform(this.state).join(' ') });
        var anchorClassname = anchor && type === 'popup' ? "mapboxgl-popup-anchor-" + anchor : '';
        return (React.createElement("div", { className: className + " " + anchorClassname, onClick: onClick, onDoubleClick: onDoubleClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onScroll: onScroll, onWheel: onWheel, style: finalStyle, ref: this.setContainer, tabIndex: tabIndex }, children));
    };
    ProjectedLayer.defaultProps = {
        offset: 0,
        onClick: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args;
        }
    };
    return ProjectedLayer;
}(React.Component));
exports.ProjectedLayer = ProjectedLayer;
exports.default = context_1.withMap(ProjectedLayer);
//# sourceMappingURL=projected-layer.js.map