import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line
import { Map } from 'mapbox-gl';

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, .3)',
  border: '1px solid rgba(0, 0, 0, 0.1)'
};

const positions = {
  topRight: { top: 10, right: 10, bottom: 'auto', left: 'auto' },
  topLeft: { top: 10, left: 10, bottom: 'auto', right: 'auto' },
  bottomRight: { bottom: 10, right: 10, top: 'auto', left: 'auto' },
  bottomLeft: { bottom: 10, left: 10, top: 'auto', right: 'auto' }
};

const buttonStyle = {
  backgroundColor: '#f9f9f9',
  opacity: 0.95,
  transition: 'background-color 0.16s ease-out',
  cursor: 'pointer',
  border: 0,
  height: 26,
  width: 26,
  backgroundImage: 'url(\'https://api.mapbox.com/mapbox.js/v2.4.0/images/icons-000000@2x.png\')',
  backgroundPosition: '0px 0px',
  backgroundSize: '26px 260px',
  outline: 0
};

const buttonStyleHovered = {
  backgroundColor: '#fff',
  opacity: 1
};

const buttonStylePlus = {
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  borderTopLeftRadius: 2,
  borderTopRightRadius: 2
};

const buttonStyleMinus = {
  backgroundPosition: '0px -26px',
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2
};

const [PLUS, MINUS] = [0, 1];
const POSITIONS = Object.keys(positions);

export interface Props {
  zoomDiff: number;
  onControlClick: (map: Map, zoomDiff: number) => void;
  position: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  style: React.CSSProperties;
  className: string;
}

export interface State {
  hover?: number;
}

export interface Context {
  map: Map;
}

export default class ZoomControl extends React.Component<Props, State> {

  public context: Context;

  public static defaultProps = {
    position: POSITIONS[0],
    zoomDiff: 0.5,
    onControlClick: (map: Map, zoomDiff: number) => {
      map.zoomTo(map.getZoom() + zoomDiff);
    }
  };

  public state = {
    hover: undefined
  };

  public static contextTypes = {
    map: PropTypes.object
  };

  private onMouseOut = () => {
    if (!this.state.hover) {
      this.setState({ hover: undefined });
    }
  }

  private plusOver = () => {
    if (PLUS !== this.state.hover) {
      this.setState({ hover: PLUS });
    }
  }

  private minusOver = () => {
    if (MINUS !== this.state.hover) {
      this.setState({ hover: MINUS });
    }
  }

  private onClickPlus = () => {
    this.props.onControlClick(this.context.map, this.props.zoomDiff);
  }

  private onClickMinus = () => {
    this.props.onControlClick(this.context.map, -this.props.zoomDiff);
  }

  public render() {
    const { position, style, className } = this.props;
    const { hover } = this.state;

    return (
      <div
        className={className}
        style={{ ...containerStyle, ...positions[position], ...style }}
      >
        <button
          type="button"
          style={{ ...buttonStyle, ...buttonStylePlus, ...(hover === PLUS ? buttonStyleHovered : {}) }}
          onMouseOver={this.plusOver}
          onMouseOut={this.onMouseOut}
          onClick={this.onClickPlus}
        />
        <button
          type="button"
          style={{ ...buttonStyle, ...buttonStyleMinus, ...(hover === MINUS ? buttonStyleHovered : {}) }}
          onMouseOver={this.minusOver}
          onMouseOut={this.onMouseOut}
          onClick={this.onClickMinus}
        />
      </div>
    );
  }
}
