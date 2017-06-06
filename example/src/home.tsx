import * as React from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import styled from 'styled-components';
import code from './home-code';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const StyledProvider = styled(LiveProvider)`
  margin: auto;
  display: flex;
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

const StyledPreview = styled(LivePreview)``;

const MapCode = () => (
  <StyledProvider
    code={code}
    mountStylesheet={false}
    scope={{ ReactMapboxGl, Layer, Feature } as any}
  >
    <StyledEditor contentEditable={false}/>
    <StyledPreview/>
    <LiveError/>
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
