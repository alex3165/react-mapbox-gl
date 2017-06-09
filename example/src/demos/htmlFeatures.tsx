import * as React from 'react';
import ReactMapboxGl, { Marker } from '../../../';
import styled from 'styled-components';
import Dropdown from '../dropdown';

// tslint:disable-next-line:no-var-requires
const { londonCycle } = require('./config.json');
const { accessToken, style } = londonCycle;
// tslint:disable-next-line:max-line-length
const mapboxGeocoding = (query: string) => `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}`;

const Container = styled.div`

`;

const Map = ReactMapboxGl({ accessToken });

const mapStyle = {
  height: '400px',
  width: '65%',
  margin: '30px auto'
};

// Marker, Popup, Cluster

export interface Place {
  id: string;
  name: string;
  center: number[];
}

export interface State {
  query: string;
  options: Place[];
  selected?: Place;
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
    selected: undefined
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
    this.setState({
      selected: this.state.options[index]
    });
  };

  private onSearch = ({ target }: any) => {
    if (target.value.length > 2) {
      this.setState({
        query: target.value
      });

      this.fetch(target.value);
    }
  }

  public render() {
    const { options, selected } = this.state;

    return (
      <Container>
        <Dropdown
          onSearch={this.onSearch}
          onSelectItem={this.onSelectItem}
          options={options}
        />
        <Map
          style={style}
          containerStyle={mapStyle}
        >
          {
            selected && (
              <Marker coordinates={selected.center}>
                <div>
                  Test
                </div>
              </Marker>
            )
          }
        </Map>
      </Container>
    );
  }
};

export default HtmlFeatures;
