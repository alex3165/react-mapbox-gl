import * as React from 'react';
import LondonCycleMap from './londonCycle';
import AllShapes from './allShapes';
import HtmlFeatures from './htmlFeatures';
import ThreeDMap from './threeDMap';
import HtmlCluster from './htmlCluster';
import SwitchStyle from './switchStyle';
import GeoJsonLayer from './geojsonLayer';

import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 22px;
  color: #34495e;
  margin-top: 14px;
  margin-bottom: 6px;
  max-width: 300px;
`;

const Top = styled.div`
  background-color: white;
  padding: 6px 30px;
  borde-radius: 5px;
`;

const Section = styled.div`
  width: 75%;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Components = styled.div`
  color: #bbb;
  margin-bottom: 10px;
`;

const Menu = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: center;
`;

const Item = styled.li`
  margin: 0px 10px;
  font-weight: ${({ selected }) => selected ? 700 : 100};
  cursor: pointer;
`;

const sections = [
  {
    shortTitle: 'london-cycle',
    title: 'Bike stations in London',
    components: ['ReactMapboxGl', 'Layer', 'Feature'],
    DemoComponent: LondonCycleMap
  },
  {
    shortTitle: 'all-shapes',
    title: 'Mapbox webgl shapes',
    components: ['ReactMapboxGl', 'Layer', 'Feature', 'ScaleControl', 'ZoomControl', 'RotationControl'],
    DemoComponent: AllShapes
  },
  {
    shortTitle: 'html-marker',
    title: 'Html features (Marker)',
    components: ['ReactMapboxGl', 'Marker'],
    DemoComponent: HtmlFeatures
  },
  {
    shortTitle: '3d-map',
    title: '3D extrusion map',
    components: ['ReactMapboxGl', 'Layer'],
    DemoComponent: ThreeDMap
  },
  {
    shortTitle: 'html-cluster',
    title: 'Cluster of Html markers',
    components: ['ReactMapboxGl', 'Marker', 'Cluster'],
    DemoComponent: HtmlCluster
  },
  {
    shortTitle: 'switch-style',
    title: 'Swap Mapbox map style',
    components: ['ReactMapboxGl', 'Source', 'Layer', 'Feature'],
    DemoComponent: SwitchStyle
  },
  {
    shortTitle: 'geojson-data',
    title: 'Display data from GeoJson',
    components: ['ReactMapboxGl', 'GeoJsonLayer'],
    DemoComponent: GeoJsonLayer
  }
];

export interface State {
  selectedDemoIndex: number;
}

class Demos extends React.Component<{}, State> {
  public state: State = {
    selectedDemoIndex: parseInt(localStorage.getItem('selectedDemoIndex') || '0', 10)
  }

  private onSelectExample(index: number) {
    this.setState({
      selectedDemoIndex: index
    });
    localStorage.setItem('selectedDemoIndex', JSON.stringify(index));
  }

  public render() {
    const { selectedDemoIndex } = this.state;
    const { title, components, DemoComponent } = sections[selectedDemoIndex];
    return (
      <Container>
        <Menu>
          {
            sections.map((section, index) => (
              <Item key={index} onClick={this.onSelectExample.bind(this, index)} selected={selectedDemoIndex === index}>
                {section.shortTitle}
              </Item>
            ))
          }
        </Menu>
        <Section>
          <Top>
            <Title>{title}</Title>
            <Components>
              Components: {components.join(', ')}
            </Components>
          </Top>
          <DemoComponent/>
        </Section>
      </Container>
    );
  }
}

export default Demos;
