import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "./redux-store/store";
import { mergeStyles } from "@fluentui/merge-styles";
import ContextProvider from "./SockectContext";

// Inject some global style
mergeStyles({
  selectors: {
    ":global(body), :global(html), :global(#root)": {
      margin: 0,
      padding: 0,
      height: "100vh",
      fontFamily: "Segoe UI Web (West European)",
    },
  },
});

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store()}>
      <React.StrictMode>
        <ContextProvider>
          <App />
        </ContextProvider>
      </React.StrictMode>
      {/* </ContextProvider> */}
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
