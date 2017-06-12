import * as React from 'react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import styled from 'styled-components';
import code from './home-code';
import ReactMapboxGl, { Layer, Feature } from '../../';

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div``;

const StyledProvider = styled(LiveProvider)`
  margin: auto;
  display: flex;
  justify-content: center;
`;

const Description = styled.p`
  text-align: center;
  maxWidth: 900px;
  margin-bottom: 60px;
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
      <Container>
        <Wrapper>
          <Description>
            Simple to use with declarative API WebGl Mapbox map in React.
          </Description>
          <MapCode/>
        </Wrapper>
      </Container>
    );
  }
};

export default Home;
