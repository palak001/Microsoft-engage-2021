import React from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import { SignUp } from './containers/SignUp/SignUp';



function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={() => <SignUp/>}></Route>
      </Switch>
    </div>
  );
}

export default App;
