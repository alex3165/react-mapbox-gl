// tslint:disable
import * as React from 'react';

export interface Props {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

const svgStyle = {
  fillRule: 'evenodd',
  clipRule: 'evenodd',
  strokeLinejoin: 'round',
  strokeMiterlimit: 1.41421
};

const fillStyle = {
  fill: '#5498ff'
};

const shapeStyle = Object.assign({}, fillStyle, { fillRule: 'nonzero' });

const svg: React.StatelessComponent<Props> = ({ width = '20%', height = '20%', style = {} }) => (
  <svg width={width} height={height} viewBox="0 0 512 534" style={{ ...svgStyle, ...style }}>
    <g id="logo">
      <path id="Shape" d="M246.679,155.766c52.126,0 94.413,43.442 94.413,97.043c0,87.312 -75.53,145.532 -94.413,145.532c-18.883,0 -94.414,-58.22 -94.414,-145.541c0,-53.592 42.288,-97.034 94.414,-97.034Zm0,135.847c20.856,0 37.765,-17.378 37.765,-38.813c0,-21.435 -16.909,-38.814 -37.765,-38.814c-20.856,0 -37.765,17.379 -37.765,38.814c0,21.435 16.909,38.813 37.765,38.813Z" style={shapeStyle}/>
      <g id="Path">
        <path d="M451.249,370.214l18.964,10.538c-39.494,86.003 -124.639,145.513 -223.308,145.513c-31.022,0 -60.707,-5.882 -88.057,-16.622l14.875,-17.984c22.945,8.096 47.564,12.491 73.182,12.491c90.49,0 168.518,-54.834 204.344,-133.936Zm-353.932,-299.347l16.929,14.61c-56.14,42.106 -92.616,110.248 -92.616,187.146c0,56.995 20.038,109.18 53.269,149.519l-12.062,19.442c-39.01,-44.858 -62.725,-104.063 -62.725,-168.961c0,-82.283 38.123,-155.415 97.205,-201.756Zm133.64,-51.366c5.273,-0.346 10.59,-0.521 15.948,-0.521c135.271,0 245.124,111.852 246.774,250.476l-21.881,-10.422c-6.844,-121.544 -104.915,-217.939 -224.893,-217.939c-2.042,0 -4.077,0.028 -6.106,0.084l6.106,-9.881l-15.948,-11.797Z" style={fillStyle}/>
      </g>
      <ellipse id="Oval" cx="95.338" cy="87.522" rx="28.324" ry="29.11" style={fillStyle}/>
      <ellipse id="Oval.-Copy.-2" cx="68.324" cy="427.11" rx="28.324" ry="29.11" style={fillStyle}/>
      <ellipse id="Oval.-Copy.-3" cx="180.324" cy="504.11" rx="28.324" ry="29.11" style={fillStyle}/>
      <ellipse id="Oval.-Copy.-4" cx="450.324" cy="398.11" rx="28.324" ry="29.11" style={fillStyle}/>
      <ellipse id="Oval.-Copy.-5" cx="483.354" cy="261.494" rx="28.324" ry="29.11" style={fillStyle}/>
      <ellipse id="Oval.-Copy" cx="227.952" cy="29.11" rx="28.324" ry="29.11" style={fillStyle}/>
    </g>
  </svg>
);

export default svg;