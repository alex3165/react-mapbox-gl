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
var scales = [
    0.01,
    0.02,
    0.05,
    0.1,
    0.2,
    0.5,
    1,
    2,
    5,
    10,
    20,
    50,
    100,
    200,
    500,
    1000,
    2 * 1000,
    5 * 1000,
    10 * 1000
];
var positions = {
    'top-right': { top: 10, right: 10, bottom: 'auto', left: 'auto' },
    'top-left': { top: 10, left: 10, bottom: 'auto', right: 'auto' },
    'bottom-right': { bottom: 10, right: 10, top: 'auto', left: 'auto' },
    'bottom-left': { bottom: 10, left: 10, top: 'auto', right: 'auto' }
};
var containerStyle = {
    position: 'absolute',
    zIndex: 10,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, .3)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    right: 50,
    backgroundColor: '#fff',
    opacity: 0.85,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    padding: '3px 7px'
};
var scaleStyle = {
    border: '2px solid #7e8490',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, .3)',
    borderTop: 'none',
    height: 7,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1
};
var POSITIONS = Object.keys(positions);
var MEASUREMENTS = ['km', 'mi'];
var MILE_IN_KILOMETERS = 1.60934;
var MILE_IN_FEET = 5280;
var KILOMETER_IN_METERS = 1000;
var MIN_WIDTH_SCALE = 60;
var ScaleControl = (function (_super) {
    __extends(ScaleControl, _super);
    function ScaleControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            chosenScale: 0,
            scaleWidth: MIN_WIDTH_SCALE
        };
        _this.setScale = function () {
            var map = _this.context.map;
            var measurement = _this.props.measurement;
            var clientWidth = map._canvas.clientWidth;
            var _a = map.getBounds(), _ne = _a._ne, _sw = _a._sw;
            var totalWidth = _this._getDistanceTwoPoints([_sw.lng, _ne.lat], [_ne.lng, _ne.lat], measurement);
            var relativeWidth = totalWidth / clientWidth * MIN_WIDTH_SCALE;
            var chosenScale = scales.reduce(function (acc, curr) {
                if (!acc && curr > relativeWidth) {
                    return curr;
                }
                return acc;
            }, 0);
            var scaleWidth = chosenScale / totalWidth * clientWidth;
            _this.setState({
                chosenScale: chosenScale,
                scaleWidth: scaleWidth
            });
        };
        return _this;
    }
    ScaleControl.prototype.componentWillMount = function () {
        this.setScale();
        this.context.map.on('zoomend', this.setScale);
    };
    ScaleControl.prototype.componentWillUnmount = function () {
        if (this.context.map) {
            this.context.map.off('zoomend', this.setScale);
        }
    };
    ScaleControl.prototype._getDistanceTwoPoints = function (x, y, measurement) {
        if (measurement === void 0) { measurement = 'km'; }
        var lng1 = x[0], lat1 = x[1];
        var lng2 = y[0], lat2 = y[1];
        var R = measurement === 'km' ? 6371 : 6371 / MILE_IN_KILOMETERS;
        var dLat = this._deg2rad(lat2 - lat1);
        var dLng = this._deg2rad(lng2 - lng1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._deg2rad(lat1)) *
                Math.cos(this._deg2rad(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    };
    ScaleControl.prototype._deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };
    ScaleControl.prototype._displayMeasurement = function (measurement, chosenScale) {
        if (chosenScale >= 1) {
            return chosenScale + " " + measurement;
        }
        if (measurement === 'mi') {
            return Math.floor(chosenScale * MILE_IN_FEET) + " ft";
        }
        return Math.floor(chosenScale * KILOMETER_IN_METERS) + " m";
    };
    ScaleControl.prototype.render = function () {
        var _a = this.props, measurement = _a.measurement, style = _a.style, position = _a.position, className = _a.className, tabIndex = _a.tabIndex;
        var _b = this.state, chosenScale = _b.chosenScale, scaleWidth = _b.scaleWidth;
        return (React.createElement("div", { tabIndex: tabIndex, style: __assign({}, containerStyle, positions[position], style), className: className },
            React.createElement("div", { style: __assign({}, scaleStyle, { width: scaleWidth }) }),
            React.createElement("div", { style: { paddingLeft: 10 } }, this._displayMeasurement(measurement, chosenScale))));
    };
    ScaleControl.contextTypes = {
        map: PropTypes.object
    };
    ScaleControl.defaultProps = {
        measurement: MEASUREMENTS[0],
        position: POSITIONS[2]
    };
    return ScaleControl;
}(React.Component));
exports.default = ScaleControl;
//# sourceMappingURL=scale-control.js.map