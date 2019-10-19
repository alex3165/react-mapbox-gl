import * as React from 'react';
import { sections } from './sections';
import styled from 'styled-components';

const Menu = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  padding: 12px;
  margin: 0px;
  background-color: white;
  border-right: 1px solid rgb(235, 235, 235);
  width: 200px;
`;

interface ItemProps {
  selected: boolean;
}

const Item =
  // eslint-disable-next-line
  styled.li <
  ItemProps >
  `
  margin: 0px 10px;
  padding: 20px 0px;
  font-weight: ${({ selected }) => (selected ? 700 : 100)};
  cursor: pointer;
`;

export interface Props {
  onSelectExample: (index: number) => void;
  selectedIndex: number;
}

export default class Sidebar extends React.Component<Props> {
  public render() {
    const { onSelectExample, selectedIndex } = this.props;
    return (
      <Menu>
        {sections.map((section, index) => (
          <Item
            key={index}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => onSelectExample(index)}
            selected={selectedIndex === index}
          >
            {section.shortTitle}
          </Item>
        ))}
      </Menu>
    );
  }
}
