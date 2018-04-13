"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var css_1 = require("../constants/css");
var injectCSS = function (window) {
    if (window && typeof window === 'object' && window.document) {
        var document_1 = window.document;
        var head = document_1.head || document_1.getElementsByTagName('head')[0];
        var styleElement = document_1.createElement('style');
        styleElement.innerHTML = css_1.default;
        head.appendChild(styleElement);
    }
};
exports.default = injectCSS;
//# sourceMappingURL=inject-css.js.map