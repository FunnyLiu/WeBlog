import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";

function BasicExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            {/* 路由跳转 */}
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>

        <hr />

        {/* 路由解析对接组件 */}
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </div>
    </Router>
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

// 一级路由组件，内嵌二级路由组件
function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
            {/* match.url为当前路由url,url用于link的匹配，match对象相关api：https://reacttraining.com/react-router/web/api/match */}
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>
        {/* topicId为参数,path用于route的匹配 */}
      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Topic({ match }) {
  return (
    <div>
        {/* 通过match.params取参数 */}
      <h3>{match.params.topicId}</h3>
    </div>
  );
}

export default BasicExample;