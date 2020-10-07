"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassName = function (defaultClassName, className) {
    return className
        ? className
            .split(' ')
            .concat(defaultClassName)
            .join(' ')
        : defaultClassName.join(' ');
};
//# sourceMappingURL=classname.js.map