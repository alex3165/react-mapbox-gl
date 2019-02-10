import * as React from 'react';
import ReactMapboxGl, { Marker } from '../../../';
import styled from 'styled-components';
import Dropdown from '../dropdown';

// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');
const geocodingUrl = 'https://api.mapbox.com/geocoding/v5';
// tslint:disable-next-line:max-line-length
const mapboxGeocoding = (query: string) =>
  `${geocodingUrl}/mapbox.places/${query}.json?access_token=${token}`;

const Container = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
`;

const Mark = styled.div`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 4px solid #eaa29b;
`;

const Map = ReactMapboxGl({ accessToken: token });

const mapStyle = {
  width: '100%',
  height: '100%'
};

export interface Place {
  id: string;
  name: string;
  center: [number, number];
}

export interface State {
  query: string;
  options: Place[];
  selected?: Place;
  center: [number, number];
}

const req = (url: string, body?: any, method = 'GET') =>
  new Request(url, {
    method,
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Charset': 'utf-8'
    }),
    body
  });

export interface Props {
  // tslint:disable-next-line:no-any
  onStyleLoad?: (map: any) => any;
}

class HtmlFeatures extends React.Component<Props, State> {
  public state: State = {
    query: '',
    options: [],
    selected: undefined,
    center: [-0.1148677, 51.5139573]
  };

  private fetch = (query: string) => {
    fetch(req(mapboxGeocoding(query)))
      .then((res: any) => res.json())
      .then((data: any) => {
        this.setState({
          options: data.features
            .filter((place: any) => place.place_type.includes('poi'))
            .map((poi: any) => ({
              id: poi.id,
              center: poi.center,
              name: poi.text
            }))
        });
      });
  };

  private onSelectItem = (index: number) => {
    const selected = this.state.options[index];
    this.setState({
      selected,
      center: selected.center
    });
  };

  private onSearch = (query: string) => {
    this.setState({ query });
    this.fetch(query);
  };

  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  public render() {
    const { options, selected, center } = this.state;
    return (
      <Container>
        <Dropdown
          onSearch={this.onSearch}
          onSelectItem={this.onSelectItem}
          options={options}
        />
        <Map
          style={styles.light}
          containerStyle={mapStyle}
          center={center}
          onStyleLoad={this.onStyleLoad}
        >
          {selected && (
            <Marker coordinates={selected.center}>
              <Mark />
            </Marker>
          )}
        </Map>
      </Container>
    );
  }
}

export default HtmlFeatures;
