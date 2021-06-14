import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import AuthRoute from "./Auth/AuthRouter";
import { auth } from "./config/firebase";
import { MainPage } from "./containers/MainPage/MainPage";
import { SignUp } from "./containers/SignUp/SignUp";

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  // local states
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

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Switch>
        {/* <Route path="/signup" exact component={() => <SignUp />}></Route> */}
        <Route path="/" exact component={() => <MainPage />}></Route>

        <Route path="/signup" exact={true} component={() => <SignUp />} />
        <Route
          path="/"
          exact={true}
          component={() => (
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
