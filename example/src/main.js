import React, { Component } from "react";
import { BrowserRouter as Router, NavLink, Route } from 'react-router-dom';
import { default as routes } from './routes'

const styles = {
  nav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  item: {
    margin: "0px 10px",
    cursor: "pointer",
    paddingBottom: 6,
    color: "#000",
    textDecoration: "none"
  },
  activeItem: {
    color: "#4790E5",
    borderBottom: "1px solid #4790E5"
  }
};

export default class Main extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav style={styles.nav}>
            {
              routes.map(item => (
                <NavLink key={ item.path }
                  to={ item.path }
                  style={ styles.item }
                  activeStyle={ styles.activeItem }
                  exact={ item.path === "/" }
                  >{ item.label }</NavLink>
                )
              )
            }
          </nav>
          {
            routes.map(item => (
              <Route key={ item.path }
                path={ item.path }
                component={ item.component }
                exact={ item.path === "/" } />
            ))
          }
        </div>
      </Router>
    );
  }
}
