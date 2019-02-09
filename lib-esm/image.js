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
import * as React from 'react';
import { withMap } from './context';
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Image.prototype.componentWillMount = function () {
        this.loadImage(this.props);
    };
    Image.prototype.componentWillUnmount = function () {
        Image.removeImage(this.props);
    };
    Image.prototype.componentWillReceiveProps = function (nextProps) {
        var id = this.props.id;
        if (nextProps.map !== this.props.map) {
            Image.removeImage(this.props);
        }
        if (nextProps.map && !nextProps.map.hasImage(id)) {
            this.loadImage(nextProps);
        }
    };
    Image.prototype.render = function () {
        return null;
    };
    Image.prototype.loadImage = function (props) {
        var _this = this;
        var map = props.map, id = props.id, url = props.url, data = props.data, options = props.options, onError = props.onError;
        if (data) {
            map.addImage(id, data, options);
            this.loaded();
        }
        else if (url) {
            map.loadImage(url, function (error, image) {
                if (error) {
                    if (onError) {
                        onError(error);
                    }
                    return;
                }
                map.addImage(id, image, options);
                _this.loaded();
            });
        }
    };
    Image.removeImage = function (props) {
        var id = props.id, map = props.map;
        if (map) {
            map.removeImage(id);
        }
    };
    Image.prototype.loaded = function () {
        var onLoaded = this.props.onLoaded;
        if (onLoaded) {
            onLoaded();
        }
    };
    return Image;
}(React.Component));
export default withMap(Image);
//# sourceMappingURL=image.js.map