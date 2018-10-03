import cssRules from '../constants/css';

const injectCSS = () => {
  if (
    typeof window !== 'undefined'
    && typeof window === 'object'
    && window.document
  ) {
    const { document } = window;
    const head = document.head || document.getElementsByTagName('head')[0];

    const styleElement = document.createElement('style');
    styleElement.innerHTML = cssRules;
    head.appendChild(styleElement);
  }
};

export default injectCSS;
