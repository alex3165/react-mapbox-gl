import * as React from 'react';
import ReactMapboxGl from '../../../';

// tslint:disable-next-line:no-var-requires
const { londonCycle } = require('./config.json');
// tslint:disable-next-line:no-var-requires
const mapData = require('./allShapesStyle.json');

const { accessToken } = londonCycle;

const Map = ReactMapboxGl({ accessToken });

const mapStyle = {
  height: '400px',
  width: '65%',
  margin: '30px auto'
};


class AllShapes extends React.Component<{}, {}> {
  public render() {
    return (
      <Map style={mapData} containerStyle={mapStyle}/>
    );
  }
};

export default AllShapes;
