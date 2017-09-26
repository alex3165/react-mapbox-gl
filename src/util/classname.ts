export const getClassName = (
  defaultClassName: string[],
  className?: string
): string =>
  className
    ? className
        .split(' ')
        .concat(defaultClassName)
        .join(' ')
    : defaultClassName.join(' ');
