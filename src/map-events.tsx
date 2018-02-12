import * as MapboxGl from 'mapbox-gl';

export type MapEvent = (
  map: MapboxGl.Map,
  // tslint:disable-next-line:no-any
  evt: React.SyntheticEvent<any>
) => void;

export interface Events {
  onStyleLoad?: MapEvent;
  onResize?: MapEvent;
  onDblClick?: MapEvent;
  onClick?: MapEvent;
  onMouseMove?: MapEvent;
  onMouseOut?: MapEvent;
  onMoveStart?: MapEvent;
  onMove?: MapEvent;
  onMoveEnd?: MapEvent;
  onMouseDown?: MapEvent;
  onMouseUp?: MapEvent;
  onDragStart?: MapEvent;
  onDragEnd?: MapEvent;
  onDrag?: MapEvent;
  onZoomStart?: MapEvent;
  onZoom?: MapEvent;
  onZoomEnd?: MapEvent;
  onPitch?: MapEvent;
  onPitchStart?: MapEvent;
  onPitchEnd?: MapEvent;
  onWebGlContextLost?: MapEvent;
  onWebGlContextRestored?: MapEvent;
  onRemove?: MapEvent;
  onContextMenu?: MapEvent;
  onRender?: MapEvent;
  onError?: MapEvent;
  onSourceData?: MapEvent;
  onDataLoading?: MapEvent;
  onStyleDataLoading?: MapEvent;
  onTouchCancel?: MapEvent;
  onData?: MapEvent;
  onSourceDataLoading?: MapEvent;
  onTouchMove?: MapEvent;
  onTouchEnd?: MapEvent;
  onTouchStart?: MapEvent;
  onStyleData?: MapEvent;
  onBoxZoomStart?: MapEvent;
  onBoxZoomEnd?: MapEvent;
  onBoxZoomCancel?: MapEvent;
  onRotateStart?: MapEvent;
  onRotate?: MapEvent;
  onRotateEnd?: MapEvent;
}

export type EventMapping = { [T in keyof Events]: string };

export const events: EventMapping = {
  onResize: 'resize',
  onDblClick: 'dblclick',
  onClick: 'click',
  onMouseMove: 'mousemove',
  onMouseOut: 'mouseout',
  onMoveStart: 'movestart',
  onMove: 'move',
  onMoveEnd: 'moveend',
  onMouseUp: 'mouseup',
  onMouseDown: 'mousedown',
  onDragStart: 'dragstart',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onZoomStart: 'zoomstart',
  onZoom: 'zoom',
  onZoomEnd: 'zoomend',
  onPitch: 'pitch',
  onPitchStart: 'pitchstart',
  onPitchEnd: 'pitchend',
  onWebGlContextLost: 'webglcontextlost',
  onWebGlContextRestored: 'webglcontextrestored',
  onRemove: 'remove',
  onContextMenu: 'contextmenu',
  onRender: 'render',
  onError: 'error',
  onSourceData: 'sourcedata',
  onDataLoading: 'dataloading',
  onStyleDataLoading: 'styledataloading',
  onTouchCancel: 'touchcancel',
  onData: 'data',
  onSourceDataLoading: 'sourcedataloading',
  onTouchMove: 'touchmove',
  onTouchEnd: 'touchend',
  onTouchStart: 'touchstart',
  onStyleData: 'styledata',
  onBoxZoomStart: 'boxzoomstart',
  onBoxZoomEnd: 'boxzoomend',
  onBoxZoomCancel: 'boxzoomcancel',
  onRotateStart: 'rotatestart',
  onRotate: 'rotate',
  onRotateEnd: 'rotateend'
};

export type Listeners = {
  [// tslint:disable-next-line:no-any
  T in keyof Events]: (evt: React.SyntheticEvent<any>) => void
};

export const listenEvents = (
  partialEvents: EventMapping,
  props: Partial<Events>,
  map: MapboxGl.Map
) =>
  Object.keys(partialEvents).reduce(
    (listeners, event: keyof Events) => {
      const propEvent = props[event];

      if (propEvent) {
        // tslint:disable-next-line:no-any
        const listener = (evt: React.SyntheticEvent<any>) => {
          propEvent(map, evt);
        };

        map.on(partialEvents[event], listener);

        listeners[event] = listener;
      }

      return listeners;
    },
    // tslint:disable-next-line:no-object-literal-type-assertion
    {} as Listeners
  );

export const updateEvents = (
  listeners: Listeners,
  nextProps: Partial<Events>,
  map: MapboxGl.Map
) => {
  const toListenOff = Object.keys(events).filter(
    eventKey => listeners[eventKey] && typeof nextProps[eventKey] !== 'function'
  );

  toListenOff.forEach(key => {
    map.off(events[key], listeners[key]);
    delete listeners[key];
  });

  const toListenOn = Object.keys(events)
    .filter(key => !listeners[key] && typeof nextProps[key] === 'function')
    .reduce((acc, next) => ((acc[next] = events[next]), acc), {});

  const newListeners = listenEvents(toListenOn, nextProps, map);

  return { ...listeners, ...newListeners };
};
