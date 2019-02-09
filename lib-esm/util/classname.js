export var getClassName = function (defaultClassName, className) {
    return className
        ? className
            .split(' ')
            .concat(defaultClassName)
            .join(' ')
        : defaultClassName.join(' ');
};
//# sourceMappingURL=classname.js.map