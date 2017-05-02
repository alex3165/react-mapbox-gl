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
            right: 0,
            bottom: 0,
            lineHeight: 'initial',
            background: 'rgba(255,255,255,0.5)',
            padding: 5,
            pointerEvents: 'all'
          }}
        >
          { this.props.children }
        </div>
      </div>
    )
  }
}
