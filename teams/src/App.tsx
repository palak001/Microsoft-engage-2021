import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import AuthRoute from "./Auth/AuthRouter";
import { auth, db } from "./config/firebase";
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
        // check if user is already in database
        db.collection("users")
          .doc(user.email + "")
          .set({
            uid: user.uid,
          });

        console.log("user: " + auth.currentUser?.email);
        console.log("user detected");
      } else {
        console.log("No user detected");
        // redirect the user to signup page
        <Redirect to="/signup" />;
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Switch>
        {/* <Route path="/signup" exact component={() => <SignUp />}></Route> */}
        {/* <Route path="/" exact component={() => <MainPage />}></Route> */}

        <Route path="/signup" exact={true} component={() => <SignUp />} />
        <Route
          path="/"
          exact={true}
          component={() => (
            <AuthRoute>
              <MainPage />
            </AuthRoute>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
