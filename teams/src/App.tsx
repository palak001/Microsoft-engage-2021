import { useEffect, useState } from "react";
import { Route, Switch } from "react-router";
import { auth } from "./config/firebase";
import { MainPage } from "./containers/MainPage/MainPage";
import { SignUp } from "./containers/SignUp/SignUp";

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  const [loading, setLoading] = useState(true);

  // for monitoring and updating user state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user detected");
      } else {
        console.log("No user detected");
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route path="/signup" exact component={() => <SignUp />}></Route>
        <Route path="/" exact component={() => <MainPage />}></Route>
      </Switch>
    </div>
  );
};

export default App;
