import * as React from 'react';
import LondonCycleMap from './londonCycle';
import AllShapes from './allShapes';
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
        <Title>All React mapbox gl shapes</Title>
        <AllShapes/>
      </div>
    );
  }
}

export default Demos;
