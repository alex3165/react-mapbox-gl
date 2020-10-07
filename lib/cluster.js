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
var mapbox_gl_1 = require("mapbox-gl");
var supercluster_1 = require("supercluster");
var bbox = require("@turf/bbox");
var helpers_1 = require("@turf/helpers");
var Cluster = (function (_super) {
    __extends(Cluster, _super);
    function Cluster() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            superC: supercluster_1.default({
                radius: _this.props.radius,
                maxZoom: _this.props.maxZoom,
                minZoom: _this.props.minZoom,
                extent: _this.props.extent,
                nodeSize: _this.props.nodeSize,
                log: _this.props.log
            }),
            clusterPoints: [],
            zoomOnClickOptions: _this.props.zoomOnClickOptions || {}
        };
        _this.featureClusterMap = new WeakMap();
        _this.handleDeprecatedZoomOnClickPadding = function () {
            console.warn('react-mapbox-gl: Cluster zoomOnClickPadding prop is deprecated. Use zoomOnClickOptions instead');
            _this.setState(function (state) { return ({
                zoomOnClickOptions: __assign({}, state.zoomOnClickOptions, { zoomOnClickPadding: _this.props.zoomOnClickPadding })
            }); });
        };
        _this.childrenChange = function (newChildren) {
            var superC = _this.state.superC;
            _this.featureClusterMap = new WeakMap();
            var features = _this.childrenToFeatures(newChildren);
            superC.load(features);
        };
        _this.mapChange = function (forceSetState) {
            if (forceSetState === void 0) { forceSetState = false; }
            var map = _this.context.map;
            var _a = _this.state, superC = _a.superC, clusterPoints = _a.clusterPoints;
            var zoom = map.getZoom();
            var canvas = map.getCanvas();
            var w = canvas.width;
            var h = canvas.height;
            var upLeft = map.unproject([0, 0]).toArray();
            var upRight = map.unproject([w, 0]).toArray();
            var downRight = map.unproject([w, h]).toArray();
            var downLeft = map.unproject([0, h]).toArray();
            var newPoints = superC.getClusters(bbox(helpers_1.polygon([[upLeft, upRight, downRight, downLeft, upLeft]])), Math.round(zoom));
            if (newPoints.length !== clusterPoints.length || forceSetState) {
                _this.setState({ clusterPoints: newPoints });
            }
        };
        _this.childrenToFeatures = function (children) {
            return children.map(function (child) {
                var feature = _this.feature(child && child.props.coordinates);
                _this.featureClusterMap.set(feature, child);
                return feature;
            });
        };
        _this.getLeaves = function (feature, limit, offset) {
            var superC = _this.state.superC;
            return superC
                .getLeaves(feature.properties.cluster_id, limit || Infinity, offset)
                .map(function (leave) { return _this.featureClusterMap.get(leave); });
        };
        _this.zoomToClusterBounds = function (event) {
            var markers = Array.prototype.slice.call(event.currentTarget.children);
            var marker = _this.findMarkerElement(event.currentTarget, event.target);
            var index = markers.indexOf(marker);
            var cluster = _this.state.clusterPoints[index];
            if (!cluster.properties.cluster_id) {
                return;
            }
            var children = _this.state.superC.getLeaves(cluster.properties.cluster_id, Infinity);
            var childrenBbox = bbox(helpers_1.featureCollection(children));
            _this.context.map.fitBounds(mapbox_gl_1.LngLatBounds.convert(childrenBbox), _this.state.zoomOnClickOptions);
        };
        return _this;
    }
    Cluster.prototype.componentWillMount = function () {
        var map = this.context.map;
        var _a = this.props, children = _a.children, zoomOnClickPadding = _a.zoomOnClickPadding;
        if (zoomOnClickPadding) {
            this.handleDeprecatedZoomOnClickPadding();
        }
        if (children) {
            this.childrenChange(children);
        }
        map.on('move', this.mapChange);
        map.on('zoom', this.mapChange);
        this.mapChange();
    };
    Cluster.prototype.componentWillReceiveProps = function (nextProps) {
        var children = this.props.children;
        if (children !== nextProps.children && nextProps.children) {
            this.childrenChange(nextProps.children);
            this.mapChange(true);
        }
    };
    Cluster.prototype.feature = function (coordinates) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates
            },
            properties: {}
        };
    };
    Cluster.prototype.findMarkerElement = function (target, element) {
        if (element.parentNode === target) {
            return element;
        }
        return this.findMarkerElement(target, element.parentNode);
    };
    Cluster.prototype.render = function () {
        var _this = this;
        var _a = this.props, ClusterMarkerFactory = _a.ClusterMarkerFactory, style = _a.style, className = _a.className, tabIndex = _a.tabIndex;
        var clusterPoints = this.state.clusterPoints;
        return (React.createElement("div", { style: style, className: className, tabIndex: tabIndex, onClick: this.props.zoomOnClick ? this.zoomToClusterBounds : undefined }, clusterPoints.map(function (feature) {
            if (feature.properties.cluster) {
                return ClusterMarkerFactory(feature.geometry.coordinates, feature.properties.point_count, _this.getLeaves.bind(_this, feature));
            }
            return _this.featureClusterMap.get(feature);
        })));
    };
    Cluster.contextTypes = {
        map: PropTypes.object
    };
    Cluster.defaultProps = {
        radius: 60,
        minZoom: 0,
        maxZoom: 16,
        extent: 512,
        nodeSize: 64,
        log: false,
        zoomOnClick: false
    };
    return Cluster;
}(React.Component));
exports.default = Cluster;
//# sourceMappingURL=cluster.js.map