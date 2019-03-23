import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function ParamsDemo({ location }) {
  let params = new URLSearchParams(location.search);

  return (
    <div>
      <div>
        <h2>Accounts</h2>
        <ul>
          <li>
            {/* 通过search传参 */}
            <Link to={{ pathname: "/account", search: "?name=netflix" }}>
              Netflix
            </Link>
          </li>
          <li>
            <Link to={{ pathname: "/account", search: "?name=zillow-group" }}>
              Zillow Group
            </Link>
          </li>
          <li>
            <Link to={{ pathname: "/account", search: "?name=yahoo" }}>
              Yahoo
            </Link>
          </li>
          <li>
            <Link to={{ pathname: "/account", search: "?name=modus-create" }}>
              Modus Create
            </Link>
          </li>
        </ul>
        {/* 通过api拿到参数 */}
        <Child name={params.get("name")} />
      </div>
    </div>
  );
}

function Child({ name }) {
  return (
    <div>
      {name ? (
        <h3>
          The <code>name</code> in the query string is "{name}"
        </h3>
      ) : (
        <h3>There is no name in the query string</h3>
      )}
    </div>
  );
}

function ParamsExample() {
  return (
    <Router>
      <Route component={ParamsDemo} />
    </Router>
  );
}

export default ParamsExample;