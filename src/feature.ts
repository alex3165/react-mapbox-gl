import * as React from 'react';

export interface Props {
  coordinates: number[];
  properties: any;
  onClick?: Function;
  onHover?: Function;
  onEndHover?: Function;
}

const Feature: React.StatelessComponent<Props> = () => null;

export default Feature;
