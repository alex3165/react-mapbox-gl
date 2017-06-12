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
  topRight: { top: 62, right: 10, bottom: 'auto', left: 'auto' },
  topLeft: { top: 62, left: 10, bottom: 'auto', right: 'auto' },
  bottomRight: { bottom: 63, right: 10, top: 'auto', left: 'auto' },
  bottomLeft: { bottom: 63, left: 10, top: 'auto', right: 'auto' }
};

const buttonStyle = {
  backgroundColor: '#f9f9f9',
  opacity: 0.95,
  transition: 'background-color 0.16s ease-out',
  cursor: 'pointer',
  border: 0,
  height: 26,
  width: 26,
  outline: 0,
  padding: 3
};

const buttonStyleHovered = {
  backgroundColor: '#fff',
  opacity: 1
};

const buttonStyleCompass = {
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  borderTopLeftRadius: 2,
  borderTopRightRadius: 2
};

const Icon = () =>
  <svg viewBox="0 0 20 20">
    <polygon fill="#333333" points="6,9 10,1 14,9" />
    <polygon fill="#CCCCCC" points="6,11 10,19 14,11" />
  </svg>;

const compassSpan = {
  width: 20,
  height: 20,
  display: 'inline-block'
};

const [COMPASS] = [0];
const POSITIONS = Object.keys(positions);

export interface Props {
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  style?: React.CSSProperties;
  className?: string;
}

export interface State {
  hover?: number;
}

export interface Context {
  map: Map;
}

export default class RotationControl extends React.Component<Props, State> {
  public context: Context;

  public static defaultProps = {
    position: POSITIONS[0]
  };

  public state = {
    hover: undefined
  };

  public static contextTypes = {
    map: PropTypes.object
  };

  public componentDidMount() {
    this.context.map.on('rotate', this.onMapRotate);
  }

  public componentWillUnmount() {
    this.context.map.off('rotate', this.onMapRotate);
  }

  public compassIcon: any;

  private onMouseOut = () => {
    if (!this.state.hover) {
      this.setState({ hover: undefined });
    }
  };

  private onMouseIn = () => {
    if (COMPASS !== this.state.hover) {
      this.setState({ hover: COMPASS });
    }
  };

  private onClickCompass = () => {
    this.context.map.resetNorth();
  };

  private onMapRotate = () => {
    const map = this.context.map as any;
    const rotate = `rotate(${map.transform.angle * (180 / Math.PI)}deg)`; // tslint:disable-line
    this.compassIcon.style.transform = rotate;
  };

  private assignRef = (icon: any) => {
    this.compassIcon = icon;
  };

  public render() {
    const { position, style, className } = this.props;
    const { hover } = this.state;
    const controlStyle = {
      ...buttonStyle,
      ...buttonStyleCompass,
      ...hover === COMPASS ? buttonStyleHovered : {}
    };

    return (
      <div
        className={className}
        style={{ ...containerStyle, ...positions[position!], ...style }}
      >
        <button
          style={controlStyle}
          onMouseOver={this.onMouseIn}
          onMouseOut={this.onMouseOut}
          onClick={this.onClickCompass}
        >
          <span ref={this.assignRef} style={compassSpan}>
            <Icon />
          </span>
        </button>
      </div>
    );
  }
}
