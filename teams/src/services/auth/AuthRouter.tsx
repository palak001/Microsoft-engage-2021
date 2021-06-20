import React, { ReactNode } from "react";
import { Redirect } from "react-router-dom";
import { auth } from "../../config/firebase";

interface IAuthRouteProps {
  children: ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;

  // console.log(auth.currentUser?.email);
  if (!auth.currentUser) {
    // console.log("no entry");
    return <Redirect to="/signup" />;
  }
  // console.log("auth.currentUser: " + auth.currentUser);
  return <div>{children}</div>;
};

export default AuthRoute;
