import * as React from 'react';
import LondonCycleMap from './london-cycle';
import styled from 'styled-components';

const List = styled.ul`

`;

const Item = styled.li`

`;

interface MenuProps {
  selected: number;
  onSelect: (index: number) => void;
}

const Menu: React.StatelessComponent<MenuProps> = ({ onSelect, selected }) => (
  <List>
    <Item onClick={onSelect.bind(null, 0)}>London cycle</Item>
    <Item onClick={onSelect.bind(null, 0)}>All shapes</Item>
  </List>
);

export interface State {
  selected: number;
}

class Demos extends React.Component<{}, State> {

  public state = {
    selected: 0
  }

  private onSelect = (index: number) => {
    this.setState({
      selected: index
    });
  }

  public render() {
    const { selected } = this.state;
    return (
      <div>
        <Menu selected={selected} onSelect={this.onSelect}/>
        <LondonCycleMap/>
      </div>
    );
  }
}

export default Demos;
