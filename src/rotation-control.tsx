import * as React from 'react';
const PropTypes = require('prop-types'); // tslint:disable-line
import { Map } from 'mapbox-gl';

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 11,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, .3)',
  border: '1px solid rgba(0, 0, 0, 0.1)'
} as React.CSSProperties;

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

const compassSpan = {
  width: 20,
  height: 20,
  backgroundImage: 'url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2020%2020%27%3E%0A%09%3Cpolygon%20fill%3D%27%23333333%27%20points%3D%276%2C9%2010%2C1%2014%2C9%27%2F%3E%0A%09%3Cpolygon%20fill%3D%27%23CCCCCC%27%20points%3D%276%2C11%2010%2C19%2014%2C11%20%27%2F%3E%0A%3C%2Fsvg%3E")',
  backgroundRepeat: 'no-repeat',
  display: 'inline-block'
}

const [COMPASS] = [0];
const POSITIONS = Object.keys(positions);

export interface Props {
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

  public compassIcon: any;

  private onMouseOut = () => {
    if (!this.state.hover) {
      this.setState({ hover: undefined });
    }
  }

  private onMouseIn = () => {
    if (COMPASS !== this.state.hover) {
      this.setState({ hover: COMPASS });
    }
  }

  private onClickCompass = () => {
    this.context.map.resetNorth();
  }

  private onMapRotate = () => {
    const rotate = `rotate(${this.context.map.transform.angle * (180 / Math.PI)}deg)`; // tslint:disable-line
    this.compassIcon.style.transform = rotate;
  }

  public componentDidMount = () => {
    this.context.map.on('rotate', this.onMapRotate);
  }

  public componentWillUnmount = () => {
    this.context.map.off('rotate', this.onMapRotate);
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
          style={{ ...buttonStyle, ...buttonStyleCompass, ...(hover === COMPASS ? buttonStyleHovered : {}) }}
          onMouseOver={this.onMouseIn}
          onMouseOut={this.onMouseOut}
          onClick={this.onClickCompass}
        >
          <span ref={(icon) => this.compassIcon = icon}
            style={compassSpan}>
          </span>
        </button>
      </div>
    );
  }
}
