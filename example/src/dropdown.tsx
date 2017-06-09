import * as React from 'react';
import styled from 'styled-components';
import { Place } from './demos/htmlFeatures';

const Input = styled.input``;

const Container = styled.div``;

const List = styled.ul``;

const Item = styled.li``;

export interface Props {
  options: Place[];
  onSearch: (evt: any) => void;
  onSelectItem: (item: number) => void;
}

const Dropdown: React.StatelessComponent<Props> = ({
  options,
  onSearch,
  onSelectItem
}) => (
  <Container>
    <Input onChange={onSearch}/>
    <List>
      {
        options.map((el, index) => (
          <Item
            key={index}
            onClick={onSelectItem.bind(null, index)}
          >
            {el.name}
          </Item>
        ))
      }
    </List>
  </Container>
);

export default Dropdown;
