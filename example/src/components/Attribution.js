import React, { Component } from "react";

export default class Attribution extends Component {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: this.props.width,
          height: this.props.height,
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 4,
            bottom: 4,
            lineHeight: 'initial',
            fontFamily: 'Helvetica',
            background: 'white',
            padding: 4,
            pointerEvents: 'all'
          }}
        >
          { this.props.children }
        </div>
      </div>
    )
  }
}
