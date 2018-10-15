import * as React from 'react';

// Resolution for requestAnimationFrame not supported in jest error :
// https://github.com/facebook/react/issues/9102#issuecomment-283873039
// https://stackoverflow.com/a/43950142/583830

// global.window = global;
window.addEventListener = () => {}; // tslint:disable-line
window.requestAnimationFrame = () => {
  throw new Error('requestAnimationFrame is not supported in Node');
};

module.exports = React;
