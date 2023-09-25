import * as React from 'react';
import ReactMapboxGl, { Layer, Source } from '../../../';

import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');

const Map = ReactMapboxGl({ accessToken: token });

const Container = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
`;

const Button = styled.button`
  border: 1px solid #3770c6;
  background-color: rgb(84, 152, 255);
  height: 100%;
  color: white;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  :hover {
    background-color: #3770c6;
  }
`;
const Indicator = styled.div`
  padding: 6px 10px;
  background-color: white;
`;
const BottomBar = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const mapStyle = {
  height: '100%',
  width: '100%'
};

export interface Props {
  // tslint:disable-next-line:no-any
  onStyleLoad?: (map: any) => any;
}

const lineLayout = {
  'line-cap': 'round' as 'round',
  'line-join': 'round' as 'round'
};

const linePaint = {
  'line-color': '#4790E5',
  'line-width': 2
};

export interface State {
  render: 'cloudfront' | 'mapillary';
}

export default class VectorLayer extends React.Component<Props> {
  public state: State = {
    render: 'mapillary'
  };

  // tslint:disable-next-line:no-any
  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  public render() {
    const { render } = this.state;
    const tileUrl =
      render === 'mapillary'
        ? 'https://tiles3.mapillary.com/v0.1/{z}/{x}/{y}.mvt'
        : 'https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt';

    return (
      <Container>
        <Map
          style={styles.dark}
          containerStyle={mapStyle}
          onStyleLoad={this.onStyleLoad}
        >
          <Source
            id="mapillary"
            tileJsonSource={{
              type: 'vector',
              tiles: [tileUrl],
              minzoom: 6,
              maxzoom: 14
            }}
          />
          <Layer
            id="mapillary"
            type="line"
            sourceId="mapillary"
            sourceLayer="mapillary-sequences"
            layout={lineLayout}
            paint={linePaint}
          />
        </Map>
        <BottomBar>
          <Button onClick={() => this.setState({ render: 'mapillary' })}>
            Mapillary
          </Button>
          <Button onClick={() => this.setState({ render: 'cloudfront' })}>
            Cloudfront
          </Button>
          <Indicator>Using tiles from {render}</Indicator>
        </BottomBar>
      </Container>
    );
  }
}
