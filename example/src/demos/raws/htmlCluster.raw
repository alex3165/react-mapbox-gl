import * as React from 'react';
import ReactMapboxGl, { Marker, Cluster, Popup } from '../../../';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const { token, styles: { outdoor } } = require('./config.json');
// tslint:disable-next-line:no-var-requires
const falls = require('./falls.json');

const Map = ReactMapboxGl({ accessToken: token });

const mapStyle = {
  flex: 1
};

const styles: { [key: string]: React.CSSProperties } = {
  clusterMarker: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: '#51D5A0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    border: '2px solid #56C498',
    cursor: 'pointer'
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: '#E0E0E0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #C9C9C9'
  }
};

const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;

export interface State {
  popup?: {
    coordinates: GeoJSON.Position;
    total: number;
    leaves: Array<React.ReactElement<any>>;
  };
}

export interface Props {
  // tslint:disable-next-line:no-any
  onStyleLoad?: (map: any) => any;
}

class HtmlCluster extends React.Component<Props, State> {
  public state: State = {
    popup: undefined
  };

  private zoom: [number] = [4];

  private clusterMarker = (
    coordinates: GeoJSON.Position,
    pointCount: number,
    getLeaves: (
      limit?: number,
      offset?: number
    ) => Array<React.ReactElement<any>>
  ) => (
    <Marker
      key={coordinates.toString()}
      coordinates={coordinates}
      style={styles.clusterMarker}
      onClick={this.clusterClick.bind(this, coordinates, pointCount, getLeaves)}
    >
      <div>{pointCount}</div>
    </Marker>
  );

  private onMove = () => {
    if (this.state.popup) {
      this.setState({ popup: undefined });
    }
  };

  private clusterClick = (
    coordinates: GeoJSON.Position,
    total: number,
    getLeaves: (
      limit?: number,
      offset?: number
    ) => Array<React.ReactElement<any>>
  ) => {
    this.setState({
      popup: {
        coordinates,
        total,
        leaves: getLeaves()
      }
    });
  };

  // tslint:disable-next-line:no-any
  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  public render() {
    const { popup } = this.state;

    return (
      <Map
        style={outdoor}
        zoom={this.zoom}
        onStyleLoad={this.onStyleLoad}
        onMove={this.onMove}
        containerStyle={mapStyle}
        renderChildrenInPortal={true}
      >
        <Cluster ClusterMarkerFactory={this.clusterMarker}>
          {falls.features.map((feature: any, key: number) => (
            <Marker
              key={key}
              style={styles.marker}
              coordinates={feature.geometry.coordinates}
              data-feature={feature}
            >
              <div title={feature.properties.name}>
                {feature.properties.name[0]}
              </div>
            </Marker>
          ))}
        </Cluster>
        {popup && (
          <Popup offset={[0, -50]} coordinates={popup.coordinates}>
            <StyledPopup>
              {popup.leaves.map(
                (leaf: React.ReactElement<any>, index: number) => (
                  <div key={index}>
                    {leaf.props['data-feature'].properties.name}
                  </div>
                )
              )}
              {popup.total > popup.leaves.length ? (
                <div>And more...</div>
              ) : null}
            </StyledPopup>
          </Popup>
        )}
      </Map>
    );
  }
}

export default HtmlCluster;
