import * as React from 'react';
import LondonCycleMap from './london-cycle';
// const Demos: React.StatelessComponent<{}> = ({ children }) => (
//   <div>Demos page</div>
// );

class Demos extends React.Component<{}, {}> {
  public render() {
    return (
      <LondonCycleMap/>
    );
  }
}

export default Demos;
