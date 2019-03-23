import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function CustomLinkExample() {
  return (
    <Router>
      <div>
        <OldSchoolMenuLink activeOnlyWhenExact={true} to="/" label="Home" />
        <OldSchoolMenuLink to="/about" label="About" />
        <hr />
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </div>
    </Router>
  );
}
// 定义一个组件封装Link来替代直接用Link
function OldSchoolMenuLink({ label, to, activeOnlyWhenExact }) {
  return (
    <Route
      path={to}
      exact={activeOnlyWhenExact}
      // 通过children内嵌Link
      children={({ match }) => (
        <div className={match ? "active" : ""}>
          {match ? "> " : ""}
          <Link to={to}>{label}</Link>
        </div>
      )}
    />
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

export default CustomLinkExample;