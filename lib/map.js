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
var MapboxGl = require("mapbox-gl");
var React = require("react");
var PropTypes = require("prop-types");
var inject_css_1 = require("./util/inject-css");
var map_events_1 = require("./map-events");
var isEqual = require('deep-equal');
var defaultZoom = [11];
var defaultMovingMethod = 'flyTo';
var defaultCenter = [-0.2416815, 51.5285582];
var defaultContainerStyle = {
    textAlign: 'left'
};
var ReactMapboxFactory = function (_a) {
    var accessToken = _a.accessToken, apiUrl = _a.apiUrl, _b = _a.minZoom, minZoom = _b === void 0 ? 0 : _b, _c = _a.maxZoom, maxZoom = _c === void 0 ? 20 : _c, _d = _a.hash, hash = _d === void 0 ? false : _d, _e = _a.preserveDrawingBuffer, preserveDrawingBuffer = _e === void 0 ? false : _e, _f = _a.scrollZoom, scrollZoom = _f === void 0 ? true : _f, _g = _a.interactive, interactive = _g === void 0 ? true : _g, _h = _a.dragRotate, dragRotate = _h === void 0 ? true : _h, _j = _a.attributionControl, attributionControl = _j === void 0 ? true : _j, _k = _a.logoPosition, logoPosition = _k === void 0 ? 'bottom-left' : _k, _l = _a.renderWorldCopies, renderWorldCopies = _l === void 0 ? true : _l, _m = _a.trackResize, trackResize = _m === void 0 ? true : _m, _o = _a.touchZoomRotate, touchZoomRotate = _o === void 0 ? true : _o, _p = _a.doubleClickZoom, doubleClickZoom = _p === void 0 ? true : _p, _q = _a.keyboard, keyboard = _q === void 0 ? true : _q, _r = _a.dragPan, dragPan = _r === void 0 ? true : _r, _s = _a.boxZoom, boxZoom = _s === void 0 ? true : _s, _t = _a.refreshExpiredTiles, refreshExpiredTiles = _t === void 0 ? true : _t, _u = _a.failIfMajorPerformanceCaveat, failIfMajorPerformanceCaveat = _u === void 0 ? false : _u, classes = _a.classes, _v = _a.bearingSnap, bearingSnap = _v === void 0 ? 7 : _v, _w = _a.injectCss, injectCss = _w === void 0 ? true : _w, transformRequest = _a.transformRequest;
    if (injectCss) {
        inject_css_1.default(window);
    }
    return _x = (function (_super) {
            __extends(ReactMapboxGl, _super);
            function ReactMapboxGl() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = {
                    map: undefined,
                    ready: false
                };
                _this.listeners = {};
                _this._isMounted = true;
                _this.getChildContext = function () { return ({
                    map: _this.state.map
                }); };
                _this.calcCenter = function (bounds) { return [
                    (bounds[0][0] + bounds[1][0]) / 2,
                    (bounds[0][1] + bounds[1][1]) / 2
                ]; };
                _this.setRef = function (x) {
                    _this.container = x;
                };
                return _this;
            }
            ReactMapboxGl.prototype.componentDidMount = function () {
                var _this = this;
                var _a = this.props, style = _a.style, onStyleLoad = _a.onStyleLoad, center = _a.center, pitch = _a.pitch, zoom = _a.zoom, fitBounds = _a.fitBounds, fitBoundsOptions = _a.fitBoundsOptions, bearing = _a.bearing, maxBounds = _a.maxBounds;
                MapboxGl.accessToken = accessToken;
                if (apiUrl) {
                    MapboxGl.config.API_URL = apiUrl;
                }
                if (!Array.isArray(zoom)) {
                    throw new Error('zoom need to be an array type of length 1 for reliable update');
                }
                var opts = {
                    preserveDrawingBuffer: preserveDrawingBuffer,
                    hash: hash,
                    zoom: zoom[0],
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                    maxBounds: maxBounds,
                    container: this.container,
                    center: fitBounds && center === defaultCenter
                        ? this.calcCenter(fitBounds)
                        : center,
                    style: style,
                    scrollZoom: scrollZoom,
                    attributionControl: attributionControl,
                    interactive: interactive,
                    dragRotate: dragRotate,
                    renderWorldCopies: renderWorldCopies,
                    trackResize: trackResize,
                    touchZoomRotate: touchZoomRotate,
                    doubleClickZoom: doubleClickZoom,
                    keyboard: keyboard,
                    dragPan: dragPan,
                    boxZoom: boxZoom,
                    refreshExpiredTiles: refreshExpiredTiles,
                    logoPosition: logoPosition,
                    classes: classes,
                    bearingSnap: bearingSnap,
                    failIfMajorPerformanceCaveat: failIfMajorPerformanceCaveat,
                    transformRequest: transformRequest
                };
                if (bearing) {
                    if (!Array.isArray(bearing)) {
                        throw new Error('bearing need to be an array type of length 1 for reliable update');
                    }
                    opts.bearing = bearing[0];
                }
                if (pitch) {
                    if (!Array.isArray(pitch)) {
                        throw new Error('pitch need to be an array type of length 1 for reliable update');
                    }
                    opts.pitch = pitch[0];
                }
                var map = new MapboxGl.Map(opts);
                this.setState({ map: map });
                if (fitBounds) {
                    map.fitBounds(fitBounds, fitBoundsOptions);
                }
                map.on('load', function (evt) {
                    if (_this._isMounted) {
                        _this.setState({ ready: true });
                    }
                    if (onStyleLoad) {
                        onStyleLoad(map, evt);
                    }
                });
                this.listeners = map_events_1.listenEvents(map_events_1.events, this.props, map);
            };
            ReactMapboxGl.prototype.componentWillUnmount = function () {
                var map = this.state.map;
                this._isMounted = false;
                if (map) {
                    map.remove();
                }
            };
            ReactMapboxGl.prototype.componentWillReceiveProps = function (nextProps) {
                var map = this.state.map;
                if (!map) {
                    return null;
                }
                this.listeners = map_events_1.updateEvents(this.listeners, nextProps, map);
                var center = map.getCenter();
                var zoom = map.getZoom();
                var bearing = map.getBearing();
                var pitch = map.getPitch();
                var didZoomUpdate = this.props.zoom !== nextProps.zoom &&
                    (nextProps.zoom && nextProps.zoom[0]) !== zoom;
                var didCenterUpdate = this.props.center !== nextProps.center &&
                    ((nextProps.center && nextProps.center[0]) !== center.lng ||
                        (nextProps.center && nextProps.center[1]) !== center.lat);
                var didBearingUpdate = this.props.bearing !== nextProps.bearing &&
                    (nextProps.bearing && nextProps.bearing[0]) !== bearing;
                var didPitchUpdate = this.props.pitch !== nextProps.pitch &&
                    (nextProps.pitch && nextProps.pitch[0]) !== pitch;
                if (nextProps.maxBounds) {
                    var didMaxBoundsUpdate = this.props.maxBounds !== nextProps.maxBounds;
                    if (didMaxBoundsUpdate) {
                        map.setMaxBounds(nextProps.maxBounds);
                    }
                }
                if (nextProps.fitBounds) {
                    var fitBounds = this.props.fitBounds;
                    var didFitBoundsUpdate = fitBounds !== nextProps.fitBounds ||
                        nextProps.fitBounds.length !== (fitBounds && fitBounds.length) ||
                        !!fitBounds.filter(function (c, i) {
                            var nc = nextProps.fitBounds && nextProps.fitBounds[i];
                            return c[0] !== (nc && nc[0]) || c[1] !== (nc && nc[1]);
                        })[0];
                    if (didFitBoundsUpdate ||
                        !isEqual(this.props.fitBoundsOptions, nextProps.fitBoundsOptions)) {
                        map.fitBounds(nextProps.fitBounds, nextProps.fitBoundsOptions);
                    }
                }
                if (didZoomUpdate ||
                    didCenterUpdate ||
                    didBearingUpdate ||
                    didPitchUpdate) {
                    var mm = nextProps.movingMethod || defaultMovingMethod;
                    var flyToOptions = nextProps.flyToOptions, animationOptions = nextProps.animationOptions;
                    map[mm](__assign({}, animationOptions, flyToOptions, { zoom: didZoomUpdate && nextProps.zoom ? nextProps.zoom[0] : zoom, center: didCenterUpdate ? nextProps.center : center, bearing: didBearingUpdate ? nextProps.bearing : bearing, pitch: didPitchUpdate ? nextProps.pitch : pitch }));
                }
                if (!isEqual(this.props.style, nextProps.style)) {
                    map.setStyle(nextProps.style);
                }
                return null;
            };
            ReactMapboxGl.prototype.render = function () {
                var _a = this.props, containerStyle = _a.containerStyle, className = _a.className, children = _a.children;
                var ready = this.state.ready;
                return (React.createElement("div", { ref: this.setRef, className: className, style: __assign({}, containerStyle, defaultContainerStyle) }, ready && children));
            };
            return ReactMapboxGl;
        }(React.Component)),
        _x.defaultProps = {
            onStyleLoad: function (map, evt) { return null; },
            center: defaultCenter,
            zoom: defaultZoom,
            bearing: 0,
            movingMethod: defaultMovingMethod,
            pitch: 0
        },
        _x.childContextTypes = {
            map: PropTypes.object
        },
        _x;
    var _x;
};
exports.default = ReactMapboxFactory;
//# sourceMappingURL=map.js.map