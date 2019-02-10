import * as React from 'react';
import { Map } from 'mapbox-gl';
import { AnchorLimits } from './util/types';
import { withMap } from './context';

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, .3)',
  border: '1px solid rgba(0, 0, 0, 0.1)'
};

const positions = {
  'top-right': { top: 62, right: 10, bottom: 'auto', left: 'auto' },
  'top-left': { top: 62, left: 10, bottom: 'auto', right: 'auto' },
  'bottom-right': { bottom: 63, right: 10, top: 'auto', left: 'auto' },
  'bottom-left': { bottom: 63, left: 10, top: 'auto', right: 'auto' }
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
  borderTopRightRadius: 2,
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2
};

const Icon = () => (
  <svg viewBox="0 0 20 20">
    <polygon fill="#333333" points="6,9 10,1 14,9" />
    <polygon fill="#CCCCCC" points="6,11 10,19 14,11" />
  </svg>
);

const compassSpan = {
  width: 20,
  height: 20,
  display: 'inline-block'
};

const [COMPASS] = [0];
const POSITIONS = Object.keys(positions);

export interface Props {
  position?: AnchorLimits;
  style?: React.CSSProperties;
  className?: string;
  tabIndex?: number;
  map: Map;
}

export interface State {
  hover?: number;
}

export class RotationControl extends React.Component<Props, State> {
  public static defaultProps = {
    position: POSITIONS[0]
  };

  public state = {
    hover: undefined
  };

  public componentDidMount() {
    this.props.map.on('rotate', this.onMapRotate);
  }

  public componentWillUnmount() {
    this.props.map.off('rotate', this.onMapRotate);
  }

  public compassIcon: HTMLSpanElement | null = null;

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
    this.props.map.resetNorth();
  };

  private onMapRotate = () => {
    const { map } = this.props;
    // tslint:disable-next-line:no-any
    const rotate = `rotate(${(map as any).transform.angle *
      (180 / Math.PI)}deg)`;

    if (this.compassIcon) {
      this.compassIcon.style.transform = rotate;
    }
  };

  private assignRef = (icon: HTMLSpanElement | null) => {
    this.compassIcon = icon;
  };

  public render() {
    const { position, style, className, tabIndex } = this.props;
    const { hover } = this.state;
    const controlStyle = {
      ...buttonStyle,
      ...buttonStyleCompass,
      ...(hover === COMPASS ? buttonStyleHovered : {})
    };

    return (
      <div
        className={className}
        tabIndex={tabIndex}
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

export default withMap(RotationControl);
