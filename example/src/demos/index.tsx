import * as React from 'react';
import styled from 'styled-components';
import { sections } from './sections';
import Sidebar from './sidebar';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: rows;
`;

const ToggleLive = styled.button`
  position: absolute;
  background-color: #5498ff;
  border: 1px solid #4e83d4;
  border-radius: 5px;
  padding: 10px 16px;
  margin-left: 12px;
  margin-top: 8px;
  color: white;
  outline: none;
  cursor: pointer;
  z-index: 1;
  :hover {
    background-color: #4e83d4;
  }
`;

export interface State {
  selectedDemoIndex: number;
  showLive: boolean;
  // tslint:disable-next-line:no-any
  map?: any;
}

class Demos extends React.Component<{}, State> {
  public state: State = {
    selectedDemoIndex: parseInt(
      localStorage.getItem('selectedDemoIndex') || '0',
      10
    ),
    showLive: true
  };

  private onSelectExample = (index: number) => {
    this.setState({
      selectedDemoIndex: index
    });

    localStorage.setItem('selectedDemoIndex', JSON.stringify(index));
  };

  public componentDidUpdate(prevProps: {}, prevState: State) {
    const { showLive, map } = this.state;
    if (showLive !== prevState.showLive && map) {
      map.resize();
    }
  }

  private onToggleLive = () => {
    this.setState({
      showLive: !this.state.showLive
    });
  };

  // tslint:disable-next-line:no-any
  private onStyleLoad = (map: any) => {
    this.setState({
      map
    });
  };

  public render() {
    const { selectedDemoIndex, showLive } = this.state;
    const { DemoComponent, reactLive } = sections[selectedDemoIndex];

    return (
      <Container>
        <Sidebar
          onSelectExample={this.onSelectExample}
          selectedIndex={selectedDemoIndex}
        />
        <Section>
          <ToggleLive onClick={this.onToggleLive}>
            {showLive ? 'Hide code' : 'Show code'}
          </ToggleLive>
          {showLive && reactLive}
          <DemoComponent onStyleLoad={this.onStyleLoad} />
        </Section>
      </Container>
    );
  }
}

export default Demos;
