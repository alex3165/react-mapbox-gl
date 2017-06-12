import * as React from 'react';
import ReactMapboxGl, { Marker } from '../../../';
import styled from 'styled-components';
import Dropdown from '../dropdown';

// tslint:disable-next-line:no-var-requires
const { token, styles } = require('./config.json');
// tslint:disable-next-line:max-line-length
const mapboxGeocoding = (query: string) => `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}`;

const Container = styled.div`
  position: relative;
  height: 400px;
`;

const Mark = styled.div`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 4px solid #EAA29B;
`;

const Map = ReactMapboxGl({ accessToken: token });

const mapStyle = {
  height: '100%',
  width: '100%'
};

export interface Place {
  id: string;
  name: string;
  center: number[];
}

export interface State {
  query: string;
  options: Place[];
  selected?: Place;
  center: number[];
}

const req = (url: string, body?: any, method = 'GET') => new Request(url, {
  method,
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Charset': 'utf-8'
  }),
  body
});

class HtmlFeatures extends React.Component<{}, State> {

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
  }

  public render() {
    const { options, selected, center } = this.state;
    // console.log('selected', selected);
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
        >
          {
            selected && (
              <Marker coordinates={selected.center}>
                <Mark/>
              </Marker>
            )
          }
        </Map>
      </Container>
    );
  }
};

export default HtmlFeatures;
