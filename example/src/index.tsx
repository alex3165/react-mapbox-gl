import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Home from './home';
import Demos from './demos';
import Root from './root';

function render() {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/" component={Root}>
        <IndexRoute component={Home}/>
        <Route path="/demos" component={Demos}/>
      </Route>
    </Router>,
    document.getElementById('root')
  );
}

render();
