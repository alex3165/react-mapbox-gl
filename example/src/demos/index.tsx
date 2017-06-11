import * as React from 'react';
import LondonCycleMap from './londonCycle';
import AllShapes from './allShapes';
import HtmlFeatures from './htmlFeatures';
import ThreeDMap from './threeDMap';
import HtmlCluster from './htmlCluster';

import styled from 'styled-components';

const Title = styled.h1`
  font-weight: 600;
  font-size: 24px;
`;

class Demos extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <Title>Bike stations in London</Title>
        <LondonCycleMap/>
        <Title>Mapbox webgl shapes</Title>
        <AllShapes/>
        <Title>React mapbox features</Title>
        <HtmlFeatures/>
        <Title>3D extrusion mapbox map</Title>
        <ThreeDMap/>
        <Title>Html cluster features</Title>
        <HtmlCluster/>
      </div>
    );
  }
}

export default Demos;
