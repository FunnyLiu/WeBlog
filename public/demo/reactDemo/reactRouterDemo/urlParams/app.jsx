import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";

function ParamsExample() {
  return (
    <Router>
      <div>
        <h2>Accounts</h2>
        <ul>
          <li>
            <Link to="/netflix">Netflix</Link>
          </li>
          <li>
            <Link to="/zillow-group">Zillow Group</Link>
          </li>
          <li>
            <Link to="/yahoo">Yahoo</Link>
          </li>
          <li>
            <Link to="/modus-create">Modus Create</Link>
          </li>
        </ul>
        {/* 通过path匹配，并将id传到match.params.id */}
        <Route path="/:id" component={Child} />

        {/*
           It's possible to use regular expressions to control what param values should be matched.
              * "/order/asc"  - matched
              * "/order/desc" - matched
              * "/order/foo"  - not matched
        */}
        {/* 特定路由参数匹配 */}
        <Route
          // path相关api：https://reacttraining.com/react-router/web/api/Route/path-string-string
          path="/order/:direction(asc|desc)"
          component={ComponentWithRegex}
        />
      </div>
    </Router>
  );
}

function Child({ match }) {
  return (
    <div>
      <h3>ID: {match.params.id}</h3>
    </div>
  );
}

function ComponentWithRegex({ match }) {
  return (
    <div>
      <h3>Only asc/desc are allowed: {match.params.direction}</h3>
    </div>
  );
}

export default ParamsExample;
