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
var isEqual = require('deep-equal');
var diff_1 = require("./util/diff");
var uid_1 = require("./util/uid");
var types = ['symbol', 'line', 'fill', 'fill-extrusion', 'circle'];
var toCamelCase = function (str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
        .replace(/[\s+]|-/g, '');
};
var eventToHandler = {
    mousemove: 'OnMouseMove',
    mouseenter: 'OnMouseEnter',
    mouseleave: 'OnMouseLeave',
    mousedown: 'OnMouseDown',
    mouseup: 'OnMouseUp',
    click: 'OnClick'
};
var GeoJSONLayer = (function (_super) {
    __extends(GeoJSONLayer, _super);
    function GeoJSONLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = _this.props.id || "geojson-" + uid_1.generateID();
        _this.source = __assign({ type: 'geojson' }, _this.props.sourceOptions, { data: _this.props.data });
        _this.layerIds = [];
        _this.buildLayerId = function (type) {
            return _this.id + "-" + type;
        };
        _this.createLayer = function (type) {
            var _a = _this.props, before = _a.before, layerOptions = _a.layerOptions;
            var map = _this.context.map;
            var layerId = _this.buildLayerId(type);
            _this.layerIds.push(layerId);
            var paint = _this.props[toCamelCase(type) + "Paint"] || {};
            var visibility = Object.keys(paint).length ? 'visible' : 'none';
            var layout = _this.props[toCamelCase(type) + "Layout"] || {
                visibility: visibility
            };
            map.addLayer(__assign({ id: layerId, source: _this.id, type: type,
                paint: paint,
                layout: layout }, layerOptions), before);
            _this.mapLayerMouseHandlers(type);
        };
        _this.mapLayerMouseHandlers = function (type) {
            var map = _this.context.map;
            var layerId = _this.buildLayerId(type);
            var events = Object.keys(eventToHandler);
            events.forEach(function (event) {
                var handler = _this.props["" + toCamelCase(type) + eventToHandler[event]] || null;
                if (handler) {
                    map.on(event, layerId, handler);
                }
            });
        };
        _this.onStyleDataChange = function () {
            if (!_this.context.map.getSource(_this.id)) {
                _this.unbind();
                _this.initialize();
                _this.forceUpdate();
            }
        };
        _this.isGeoJSONSource = function (source) {
            return !!source &&
                typeof source.setData === 'function';
        };
        return _this;
    }
    GeoJSONLayer.prototype.initialize = function () {
        var map = this.context.map;
        map.addSource(this.id, this.source);
        this.createLayer('symbol');
        this.createLayer('line');
        this.createLayer('fill');
        this.createLayer('fill-extrusion');
        this.createLayer('circle');
    };
    GeoJSONLayer.prototype.unbind = function () {
        var _this = this;
        var map = this.context.map;
        if (map.getSource(this.id)) {
            var layers = map.getStyle().layers;
            if (layers) {
                layers
                    .filter(function (layer) { return layer.source === _this.id; })
                    .forEach(function (layer) { return map.removeLayer(layer.id); });
            }
            map.removeSource(this.id);
        }
        types.forEach(function (type) {
            Object.keys(eventToHandler).forEach(function (event) {
                var prop = toCamelCase(type) + eventToHandler[event];
                if (_this.props[prop]) {
                    map.off(event, _this.buildLayerId(type), _this.props[prop]);
                }
            });
        });
        this.layerIds.forEach(function (lId) {
            if (map.getLayer(lId)) {
                map.removeLayer(lId);
            }
        });
    };
    GeoJSONLayer.prototype.componentWillMount = function () {
        var map = this.context.map;
        this.initialize();
        map.on('styledata', this.onStyleDataChange);
    };
    GeoJSONLayer.prototype.componentWillUnmount = function () {
        var map = this.context.map;
        if (!map || !map.getStyle()) {
            return;
        }
        map.off('styledata', this.onStyleDataChange);
        this.unbind();
    };
    GeoJSONLayer.prototype.componentWillReceiveProps = function (props) {
        var _this = this;
        var _a = this.props, data = _a.data, before = _a.before, layerOptions = _a.layerOptions;
        var map = this.context.map;
        var source = map.getSource(this.id);
        if (!this.isGeoJSONSource(source)) {
            return;
        }
        if (props.data !== data) {
            source.setData(props.data);
            this.source = __assign({ type: 'geojson' }, props.sourceOptions, { data: props.data });
        }
        var layerFilterChanged = props.layerOptions &&
            layerOptions &&
            !isEqual(props.layerOptions.filter, layerOptions.filter);
        types.forEach(function (type) {
            var layerId = _this.buildLayerId(type);
            if (props.layerOptions && layerFilterChanged) {
                map.setFilter(layerId, props.layerOptions.filter || []);
            }
            var paintProp = toCamelCase(type) + 'Paint';
            if (!isEqual(props[paintProp], _this.props[paintProp])) {
                var paintDiff_1 = diff_1.default(_this.props[paintProp], props[paintProp]);
                Object.keys(paintDiff_1).forEach(function (key) {
                    map.setPaintProperty(layerId, key, paintDiff_1[key]);
                });
            }
            var layoutProp = toCamelCase(type) + 'Layout';
            if (!isEqual(props[layoutProp], _this.props[layoutProp])) {
                var layoutDiff_1 = diff_1.default(_this.props[layoutProp], props[layoutProp]);
                Object.keys(layoutDiff_1).forEach(function (key) {
                    map.setLayoutProperty(layerId, key, layoutDiff_1[key]);
                });
            }
            Object.keys(eventToHandler).forEach(function (event) {
                var prop = toCamelCase(type) + eventToHandler[event];
                if (props[prop] !== _this.props[prop]) {
                    if (_this.props[prop]) {
                        map.off(event, layerId, _this.props[prop]);
                    }
                    if (props[prop]) {
                        map.on(event, layerId, props[prop]);
                    }
                }
            });
            if (before !== props.before) {
                map.moveLayer(layerId, props.before);
            }
        });
    };
    GeoJSONLayer.prototype.render = function () {
        return null;
    };
    GeoJSONLayer.contextTypes = {
        map: PropTypes.object
    };
    return GeoJSONLayer;
}(React.Component));
exports.default = GeoJSONLayer;
//# sourceMappingURL=geojson-layer.js.map