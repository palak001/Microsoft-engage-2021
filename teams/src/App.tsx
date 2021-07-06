import React, { useContext, useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import AuthRoute from "./services/auth/AuthRouter";
import { auth, db } from "./config/firebase";
import { MainPage } from "./containers/MainPage/MainPage";
import { SignUp } from "./containers/SignUp/SignUp";
import { fetchUserContacts } from "./services/firebase/FetchUserContacts";
import FirebaseUser from "./interfaces/user.interface";
import { useDispatch } from "react-redux";
import { fetchUserContactsAction } from "./redux-store/Firebase/UserContactsReducer";
import { SocketContext } from "./SockectContext";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { IStackProps, Stack } from "@fluentui/react/lib/Stack";
import { ActiveSession } from "./containers/SignUp/ActiveSession";
import { MeetingComponent } from "./components/MeetingComponent";
import { PreviewComponent } from "./components/PreviewComponent";
import { fetchMeetingHistory } from "./services/firebase/FetchMeetingHistory";
import MeetingHistory from "./interfaces/meetingHistory.interface";
import { fetchMeetingHistoryAction } from "./redux-store/Firebase/MeetingHistoryReducer";
import { ChatComponent } from "./components/ChatComponent";

export interface IApplicationProps {}

const App: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  const rowProps: IStackProps = {
    verticalFill: true,
    horizontal: true,
    verticalAlign: "center",
    horizontalAlign: "center",
  };

  // local states
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        context.socket.current.connect();
        // db.collection("users").doc(user.email + "").get().then((doc) => {
        //   if(doc.exists) {}
        // })
        db.collection("users")
          .doc(user.email + "")
          .set(
            {
              uid: user.uid,
              photoURL: user.photoURL,
              displayName: user.displayName,
              email: user.email,
              socketID: "",
            },
            { merge: true }
          );
        history.push("/");
      } else history.push("/signup");
      setLoading(false);
    });
  }, [context.socket, history]);

  // // for monitoring and updating user state
  useEffect(() => {
    if (auth.currentUser) {
      fetchUserContacts().then((result: Array<FirebaseUser>) => {
        dispatch(fetchUserContactsAction(result));
      });
      fetchMeetingHistory().then((result: Array<MeetingHistory>) => {
        dispatch(fetchMeetingHistoryAction(result));
      });
      setLoading(false);
    }
  }, [dispatch, loading]);

  if (loading)
    return (
      <Stack {...rowProps}>
        <Spinner size={SpinnerSize.large} />
      </Stack>
    );

  return (
    // <BrowserRouter>
    <Switch>
      <Route path="/signup" exact={true} component={() => <SignUp />} />
      <Route path="/activesession" exact={true} component={ActiveSession} />
      {context.callStarted || context.callAccepted ? (
        <Route path="/meeting" exact={true} component={MeetingComponent} />
      ) : (
        <Route path="/meeting" exact={true} component={PreviewComponent} />
      )}

      <Route path="/chat" exact component={ChatComponent} />

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
    // </BrowserRouter>
  );
};

export default App;
