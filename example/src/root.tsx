import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import Logo from './logo';
import { browserHistory, RouteComponentProps } from 'react-router';
import { paths } from './index';

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  margin: 20px auto;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  margin-left: 10px;
  margin-top: 6px;
  margin-bottom: 6px;
  padding-right: 10px;
  color: #34495e;
  border-right: 2px solid rgb(235, 235, 235);
  font-weight: ${({ selected }) => selected ? 'bold' : 'inherit'}
`;

const ExternalLink = styled.a`
  text-decoration: none;
  margin-left: 10px;
  margin-top: 6px;
  margin-bottom: 6px;
  padding-right: 10px;
  color: #34495e;
  border-right: 2px solid rgb(235, 235, 235);
`;

const Header = styled.div`
  border-bottom: 1px solid rgb(235, 235, 235);
  background-color: white;
  padding-top: 20px;
`;

const LogoWrapper = styled.div`
  text-align: center;
`;

export interface State {
  selected: number;
}

export default class Root extends React.Component<RouteComponentProps<void, void>, State> {
  public state = {
    selected: paths.indexOf(this.props.location.pathname)
  }

  public componentWillMount() {
    browserHistory.listen(ev => {
      this.setState({
        selected: paths.indexOf(ev.pathname)
      });
    });
  }

  public render() {
    const { children } = this.props;
    const { selected } = this.state;

    return (
      <div>
        <Header>
          <LogoWrapper>
            <Logo width={120} height={120}/>
          </LogoWrapper>
          <Nav>
            <NavLink selected={selected === 0} to={paths[0]}>Home</NavLink>
            <NavLink selected={selected === 1} to={paths[1]}>Demos</NavLink>
            <ExternalLink
              href="https://github.com/alex3165/react-mapbox-gl/blob/master/docs/API.md"
              target="_blank"
            >
              Documentation
            </ExternalLink>
            <ExternalLink
              href="https://github.com/alex3165/react-mapbox-gl"
              target="_blank"
              style={{ borderRight: 0 }}
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
