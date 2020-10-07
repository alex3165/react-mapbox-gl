"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var containerStyle = {
    position: 'absolute',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, .3)',
    border: '1px solid rgba(0, 0, 0, 0.1)'
};
var positions = {
    'top-right': { top: 62, right: 10, bottom: 'auto', left: 'auto' },
    'top-left': { top: 62, left: 10, bottom: 'auto', right: 'auto' },
    'bottom-right': { bottom: 63, right: 10, top: 'auto', left: 'auto' },
    'bottom-left': { bottom: 63, left: 10, top: 'auto', right: 'auto' }
};
var buttonStyle = {
    backgroundColor: '#f9f9f9',
    opacity: 0.95,
    transition: 'background-color 0.16s ease-out',
    cursor: 'pointer',
    border: 0,
    height: 26,
    width: 26,
    outline: 0,
    padding: 3
};
var buttonStyleHovered = {
    backgroundColor: '#fff',
    opacity: 1
};
var buttonStyleCompass = {
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2
};
var Icon = function () { return (React.createElement("svg", { viewBox: "0 0 20 20" },
    React.createElement("polygon", { fill: "#333333", points: "6,9 10,1 14,9" }),
    React.createElement("polygon", { fill: "#CCCCCC", points: "6,11 10,19 14,11" }))); };
var compassSpan = {
    width: 20,
    height: 20,
    display: 'inline-block'
};
var COMPASS = [0][0];
var POSITIONS = Object.keys(positions);
var RotationControl = (function (_super) {
    __extends(RotationControl, _super);
    function RotationControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hover: undefined
        };
        _this.onMouseOut = function () {
            if (!_this.state.hover) {
                _this.setState({ hover: undefined });
            }
        };
        _this.onMouseIn = function () {
            if (COMPASS !== _this.state.hover) {
                _this.setState({ hover: COMPASS });
            }
        };
        _this.onClickCompass = function () {
            _this.context.map.resetNorth();
        };
        _this.onMapRotate = function () {
            var map = _this.context.map;
            var rotate = "rotate(" + map.transform.angle *
                (180 / Math.PI) + "deg)";
            if (_this.compassIcon) {
                _this.compassIcon.style.transform = rotate;
            }
        };
        _this.assignRef = function (icon) {
            _this.compassIcon = icon;
        };
        return _this;
    }
    RotationControl.prototype.componentDidMount = function () {
        this.context.map.on('rotate', this.onMapRotate);
    };
    RotationControl.prototype.componentWillUnmount = function () {
        this.context.map.off('rotate', this.onMapRotate);
    };
    RotationControl.prototype.render = function () {
        var _a = this.props, position = _a.position, style = _a.style, className = _a.className, tabIndex = _a.tabIndex;
        var hover = this.state.hover;
        var controlStyle = __assign({}, buttonStyle, buttonStyleCompass, (hover === COMPASS ? buttonStyleHovered : {}));
        return (React.createElement("div", { className: className, tabIndex: tabIndex, style: __assign({}, containerStyle, positions[position], style) },
            React.createElement("button", { style: controlStyle, onMouseOver: this.onMouseIn, onMouseOut: this.onMouseOut, onClick: this.onClickCompass },
                React.createElement("span", { ref: this.assignRef, style: compassSpan },
                    React.createElement(Icon, null)))));
    };
    RotationControl.defaultProps = {
        position: POSITIONS[0]
    };
    RotationControl.contextTypes = {
        map: PropTypes.object
    };
    return RotationControl;
}(React.Component));
exports.default = RotationControl;
//# sourceMappingURL=rotation-control.js.map