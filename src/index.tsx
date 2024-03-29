import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter,
  Route,
  Switch,
  HashRouter,
} from 'react-router-dom';
import Login from './pages/login/index';
// import VerifyLogin from './components/verifyLogin';

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/login" exact component={Login} />

      <Route path="/" component={App} />
      {/* <Route path="/" component={VerifyLogin} /> */}
    </Switch>
  </HashRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
