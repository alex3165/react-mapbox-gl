import * as React from 'react';
import LondonCycleMap from './londonCycle';
import AllShapes from './allShapes';
import HtmlFeatures from './htmlFeatures';
import ThreeDMap from './threeDMap';
import HtmlCluster from './htmlCluster';
import SwitchStyle from './switchStyle';
import GeoJsonLayer from './geojsonLayer';

import styled from 'styled-components';

const Title = styled.h1`
  font-weight: 600;
  font-size: 22px;
  color: #34495e;
  margin-top: 20px;
  max-width: 300px;
`;

const Top = styled.div`
  background-color: white;
  padding: 6px 30px;
  borde-radius: 5px;
`;

const Section = styled.div`
  width: 65%;
  margin: 60px auto;
`;

const Components = styled.div`
  color: #bbb;
`;

class Demos extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <Section>
          <Top>
            <Title>Bike stations in London</Title>
            <Components>
              Components: ReactMapboxGl, Layer, Feature
            </Components>
          </Top>
          <LondonCycleMap/>
        </Section>
        <Section>
          <Top>
            <Title>Mapbox webgl shapes</Title>
            <Components>
              Components: ReactMapboxGl, ScaleControl, ZoomControl, RotationControl, Layer, Feature
            </Components>
          </Top>
          <AllShapes/>
        </Section>
        <Section>
          <Top>
            <Title>Html features (Marker)</Title>
            <Components>
              Components: ReactMapboxGl, Marker
            </Components>
          </Top>
          <HtmlFeatures/>
        </Section>
        <Section>
          <Top>
            <Title>3D extrusion map</Title>
            <Components>
              Components: ReactMapboxGl, Layer
            </Components>
          </Top>
          <ThreeDMap/>
        </Section>
        <Section>
          <Top>
            <Title>Cluster of Html markers</Title>
            <Components>
              Components: ReactMapboxGl, Marker, Cluster
            </Components>
          </Top>
          <HtmlCluster/>
        </Section>
        <Section>
          <Top>
            <Title>Mapbox map style swap</Title>
            <Components>
              Components: ReactMapboxGl, Source, Layer, Feature
            </Components>
          </Top>
          <SwitchStyle/>
        </Section>
        <Section>
          <Top>
            <Title>Display data from GeoJson</Title>
            <Components>
              Components: ReactMapboxGl, GeoJsonLayer
            </Components>
          </Top>
          <GeoJsonLayer/>
        </Section>
      </div>
    );
  }
}

export default Demos;
