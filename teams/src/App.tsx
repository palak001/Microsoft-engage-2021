import React, { useContext, useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
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

const App: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  // local states
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        context.socket.connect();
        db.collection("users")
          .doc(user.email + "")
          .set({
            uid: user.uid,
            photoURL: user.photoURL,
            displayName: user.displayName,
            email: user.email,
          });
        history.push("/");
      } else history.push("/signup");
      setLoading(false);
    });
  }, [context.socket, history]);

  // // for monitoring and updating user state
  useEffect(() => {
    // console.log("when are your called");
    if (auth.currentUser) {
      fetchUserContacts().then((result: Array<FirebaseUsers>) => {
        dispatch(fetchUserContactsAction(result));
      });
      setLoading(false);
    }
  }, [dispatch, loading]);

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
