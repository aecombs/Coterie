
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import logo from '../logo.png';
import Homepage from './Homepage';
import Login from './Login';
import Dashboard from './Dashboard';
// import axios from 'axios'

const Header = () => {
  return (
  <Router>
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className=" navbar-brand float-left w-50">
          <a href="/"><img className="w-25" alt="logo" src={logo}/></a>
        </div>
        <ul className=" navbar-nav mr-auto float-left">
          <li><Link to={'/'} className="nav-link">Homepage</Link></li>
          {/* TODO: Login/Logout... */}
          {/* { authButtonText = "" }
          { session[user_id] ? authButtonText = "logout" : authButtonText = "login" }
          <li><Link to={'/'+authButtonText} className="nav-link">{authButtonText}</Link></li> */}
        </ul>
        <div className="w-50"></div>
      </nav>
      
      <Switch> 
        <Route exact path='/' component={Homepage} />
        <Route path='/dashboard' component={Dashboard} />
        <Route 
          path={'/'}
          render={() => (
          <Login 
          />
        )} />
      </Switch>
    </div>
  </Router>
  );
}
  
  export default Header;