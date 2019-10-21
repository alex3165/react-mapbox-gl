import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Home from './home';
import Demos from './demos';
import Root from './root';
import Documentation from './documentation';
import './style.css';

const { NODE_ENV } = process.env;

const getPathFromEnv = (path: string) =>
  NODE_ENV === 'development' ? path : `/react-mapbox-gl${path}`;

export const paths = [
  getPathFromEnv('/'),
  getPathFromEnv('/demos'),
  getPathFromEnv('/documentation')
];

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path={paths[0]} component={Root}>
      <IndexRoute component={Home} />
      <Route path={paths[1]} component={Demos} />
      <Route path={paths[2]} component={Documentation} />
    </Route>
  </Router>,
  document.getElementById('root')
);
