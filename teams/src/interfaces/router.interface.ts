export default interface IRoute {
  path: String;
  exact: Boolean;
  component: any;
  name: String;
  protected: Boolean; // if route is protected or not
}
