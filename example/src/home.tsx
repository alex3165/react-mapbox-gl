import * as React from 'react';
import { LiveProvider, LiveEditor } from 'react-live';
import styled from 'styled-components';
import code from './home-code';

const StyledProvider = styled(LiveProvider)`
  width: 50%;
  margin: auto;
`;

const Description = styled.p`
  text-align: center;
  width: 540px;
  margin: 30px auto;
  color: #c1c1c1;
  line-height: 30px;
  font-size: 20px;
`;

const StyledEditor = styled(LiveEditor)`
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  line-height: 18px;
`;

const MapCode = () => (
  <StyledProvider code={code}>
    <StyledEditor contentEditable={false}/>
  </StyledProvider>
);

class Home extends React.Component<{}, void> {
  public render() {
    return (
      <div>
        <Description>
          Mapbox-gl-js wrapper for React which bring the API to a
          react-friendly way and provide extra control components
        </Description>
        <MapCode/>
      </div>
    );
  }
};

export default Home;
