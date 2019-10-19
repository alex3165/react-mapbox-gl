import * as React from 'react';
// import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import styled from 'styled-components';
import code from './home-code';
import ReactMapboxGl, { Layer, Feature } from '../../';
import { Live } from './live';
import Logo from './logo';
// tslint:disable-next-line:no-var-requires
const { token } = require('./demos/config.json');

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Description = styled.p`
  text-align: center;
  maxwidth: 900px;
  color: #34495e;
  line-height: 30px;
  font-size: 20px;
`;

const LogoWrapper = styled.div`
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 220px;
  justify-content: flex-end;
`;

const Body = styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  justify-content: center;
`;

class Home extends React.Component {
  public render() {
    return (
      <Container>
        <Header>
          <LogoWrapper>
            <Logo width={120} height={120} />
          </LogoWrapper>
          <Description>
            Simple to use with declarative API WebGl Mapbox map in React.
          </Description>
        </Header>
        <Body>
          <Live
            full={false}
            raw={code}
            scope={{ ReactMapboxGl, Layer, Feature, accessToken: token }}
            preview={true}
          />
        </Body>
      </Container>
    );
  }
}

export default Home;
