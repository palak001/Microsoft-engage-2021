import React, { ReactNode } from "react";
import { Redirect } from "react-router-dom";
import { auth } from "../../config/firebase";

interface IAuthRouteProps {
  children: ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;

  if (!auth.currentUser) {
    return <Redirect to="/signup" />;
  }
  return <div>{children}</div>;
};

export default AuthRoute;
