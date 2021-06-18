import React, { useContext, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import AuthRoute from "./services/auth/AuthRouter";
import { auth, db } from "./config/firebase";
import { MainPage } from "./containers/MainPage/MainPage";
import { SignUp } from "./containers/SignUp/SignUp";
import { fetchUserContacts } from "./services/firebase/FirebaseService";
import FirebaseUsers from "./interfaces/user.interface";
import { useDispatch } from "react-redux";
import { fetchUserContactsAction } from "./redux-store/Firebase/UserContactsReducer";
import { SocketContext } from "./SockectContext";

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  const context = useContext(SocketContext);
  // local states
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // for monitoring and updating user state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      context.socket.connect();
      if (user) {
        // check if user is already in database
        db.collection("users")
          .doc(user.email + "")
          .set({
            uid: user.uid,
            photoURL: user.photoURL,
            displayName: user.displayName,
            email: user.email,
          });

        fetchUserContacts().then((result: Array<FirebaseUsers>) => {
          dispatch(fetchUserContactsAction(result));
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
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Switch>
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
