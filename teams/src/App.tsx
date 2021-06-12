import React from 'react';
import { Route, Switch } from 'react-router';
import { NavBar } from './components/Navbar/NavBar';
import { SignUp } from './containers/SignUp/SignUp';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/signup" exact component={() => <SignUp/>}></Route>
        <Route path="/" exact component={() => <NavBar/>}></Route>
      </Switch>
    </div>
  );
}

export default App;
