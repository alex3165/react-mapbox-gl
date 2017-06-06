import * as React from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import styled from 'styled-components';
import code from './home-code';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const StyledProvider = styled(LiveProvider)`
  margin: auto;
  display: flex;
  justify-content: center;
`;

const Description = styled.p`
  text-align: center;
  maxWidth: 900px;
  margin: 50px auto;
  color: #34495e;
  line-height: 30px;
  font-size: 20px;
`;

const StyledEditor = styled(LiveEditor)`
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  line-height: 18px;
`;

const StyledPreview = styled(LivePreview)``;

const accessToken = 'pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2l4b3V0Z3RpMDAxczJ4cWk2YnEzNTVzYSJ9.MFPmOyHy8DM5_CVaqPYhOg';

const MapCode = () => (
  <StyledProvider
    code={code}
    mountStylesheet={false}
    scope={{ ReactMapboxGl, Layer, Feature, accessToken } as any}
    noInline={true}
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
          Simple to use and declarative way to define a WebGl Mapbox map in React.
        </Description>
        <MapCode/>
      </div>
    );
  }
};

export default Home;
