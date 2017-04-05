import React, { Component } from "react";
import AllShapes from "./all-shapes";
import LondonCycle from "./london-cycle";
import GeoJSONExample from "./geojson-example";
import Cluster from './cluster';
import SourceClustering from './source-clustering';
import StyleUpdate from './style-update';

const examples = [
  {
    component: LondonCycle,
    label: "London cycle"
  },
  {
    component: AllShapes,
    label: "All shapes"
  },
  {
    component: GeoJSONExample,
    label: "GEOJson"
  },
  {
    component: Cluster,
    label: 'Cluster'
  },
  {
    component: SourceClustering,
    label: 'Source Clustering'
  },
  {
    component: StyleUpdate,
    label: 'Style update'
  }
];

const styles = {
  nav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  item: {
    margin: "0px 10px",
    cursor: "pointer",
    paddingBottom: 6
  },
  activeItem: {
    color: "#4790E5",
    borderBottom: "1px solid #4790E5"
  }
};

const DEFAULT_USER_POSITION = [-0.2416815, 51.5285582];

export default class Main extends Component {

  state = {
    index: 1,
    userPosition: DEFAULT_USER_POSITION
  };

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(geo => {
      let { latitude, longitude } = geo.coords;
      // It may occurr that the component has been unmounted before the geolocation finishes
      // if this method is called in a children component
      // throwing a warning
      this.setState({
        userPosition: [longitude, latitude]
      });
    }, err => {
      console.error('Cannot retrieve your current position', err);
    })
  }

  indexToExample = index => examples[index].component;

  onClick(index) {
    if (this.state.index !== index) {
      this.setState({ index });
    }
  }

  render() {
    const Component = this.indexToExample(this.state.index);

    return (
      <div>
        <nav style={styles.nav}>
          {
            examples.map((item, index) =>
              <div
                key={index}
                style={{
                  ...styles.item,
                  ...(index === this.state.index && styles.activeItem)
                }}
                onClick={this.onClick.bind(this, index)}>
                {
                  item.label
                }
              </div>
            )
          }
        </nav>
        <Component userPosition={this.state.userPosition} />
      </div>
    );
  }
}