import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';

function App() {

  return (
      <Router>
        <Switch>
          <Route exact path='/'>
              <Home />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/register'>
              <Register />
          </Route>
          <Route exact path='*'>
            <Redirect to='/' />
          </Route>

        </Switch>
      </Router>
  )
}

export default App;
