import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import Logo from './logo';

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  margin: 20px auto;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  padding: 6px;
  color: #34495e;
`;

const ExternalLink = styled.a`
  text-decoration: none;
  padding: 6px;
  color: #34495e;
`;

const Header = styled.div`
`;

const LogoWrapper = styled.div`
  text-align: center;
  margin: 20px auto;
`;


export default class Root extends React.Component<{}, void> {
  public render() {
    const { children } = this.props;

    return (
      <div>
        <Header>
          <LogoWrapper>
            <Logo width={120} height={120}/>
          </LogoWrapper>
          <Nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/demos">Demos</NavLink>
            <ExternalLink
              href="https://github.com/alex3165/react-mapbox-gl/blob/master/docs/API.md"
              target="_blank"
            >
              Documentation
            </ExternalLink>
            <ExternalLink
              href="https://github.com/alex3165/react-mapbox-gl"
              target="_blank"
            >
              Github
            </ExternalLink>
          </Nav>
        </Header>
        {children}
      </div>
    );
  }
};
