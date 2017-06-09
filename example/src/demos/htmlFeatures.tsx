import * as React from 'react';
import ReactMapboxGl from '../../../';

// tslint:disable-next-line:no-var-requires
const { londonCycle } = require('./config.json');
const { accessToken, style } = londonCycle;

const Map = ReactMapboxGl({ accessToken });

const mapStyle = {
  height: '400px',
  width: '65%',
  margin: '30px auto'
};

class HtmlFeatures extends React.Component<{}, {}> {
  public render() {
    return (
      <Map
        style={style}
        containerStyle={mapStyle}
      />
    );
  }
};

export default HtmlFeatures;
