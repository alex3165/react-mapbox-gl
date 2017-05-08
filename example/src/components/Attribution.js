import React from "react";

export default function Attribution(props) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: props.width,
        height: props.height,
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
        { props.children }
      </div>
    </div>
  )
}
