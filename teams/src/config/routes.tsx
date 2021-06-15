import { MainPage } from "../containers/MainPage/MainPage";
import { SignUp } from "../containers/SignUp/SignUp";
import IRoute from "../interfaces/router.interface";

const routes: IRoute[] = [
  {
    path: "/",
    exact: true,
    component: MainPage,
    name: "Main Page",
    protected: true,
  },
  {
    path: "/signup",
    exact: true,
    component: SignUp,
    name: "Sign Up",
    protected: false,
  },
];

export default routes;
