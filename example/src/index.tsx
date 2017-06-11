import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Home from './home';
import Demos from './demos';
import Root from './root';

export const paths = [
  '/',
  '/demos'
]

function render() {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path={paths[0]} component={Root}>
        <IndexRoute component={Home}/>
        <Route path={paths[1]} component={Demos}/>
      </Route>
    </Router>,
    document.getElementById('root')
  );
}

render();
