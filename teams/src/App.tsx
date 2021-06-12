import { Route, Switch } from "react-router";
import { MainPage } from "./containers/MainPage/MainPage";
import { SignUp } from "./containers/SignUp/SignUp";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/signup" exact component={() => <SignUp />}></Route>
        <Route path="/" exact component={() => <MainPage />}></Route>
      </Switch>
    </div>
  );
}

export default App;
