// import { BrowserRouter as Router, Route, Link, Switch, History } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';

import RegistrationPage from './components/RegistrationPageView.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import StudentHomepage from './components/StudentHomepageView.jsx';
import OwnerHomepage from './components/OwnerHomepageView.jsx';
import StudentVideo from './components/StudentVideoView.jsx';
import LandingPage from './components/LandingPageView.jsx';
import OwnerVideo from './components/OwnerVideoView.jsx';

import AuthButton from './AuthButton.js';
import fakeAuth from './utils/fakeAuth.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false
    }
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  render () {

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={
        props => fakeAuth.isAuthenticated
          ? (<Component {...props} />)
          : (<Redirect to={{ pathname: "/", state: { from: props.location } }} /> )
        }
      />
    );

    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Route path='/' render={(props) => (<LandingPage { ...props } data={ this.login }/>)}/>
            <Route exact path="/registration" component={ RegistrationPage }/>
            <PrivateRoute exact path="/student" component={ StudentHomepage }/>
            <PrivateRoute exact path="/student/video" component={ StudentVideo }/>
            <PrivateRoute exact path="/owner" component={ OwnerHomepage }/>
            <PrivateRoute exact path="/owner/video" component={ OwnerVideo }/>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

// <AuthExample />

// <Route exact path="/" component={ LandingPage }/>

      // <MuiThemeProvider>
      //   <Router>
      //     <div>
      //       <Route path='/' render={(props) => (<LandingPage { ...props } data={ this.login }/>)}/>
      //       <Route exact path="/registration" component={ RegistrationPage }/>
      //       <PrivateRoute exact path="/student" component={ StudentHomepage }/>
      //       <PrivateRoute exact path="/student/video" component={ StudentVideo }/>
      //       <PrivateRoute exact path="/owner" component={ OwnerHomepage }/>
      //       <PrivateRoute exact path="/owner/video" component={ OwnerVideo }/>
      //     </div>
      //   </Router>
      // </MuiThemeProvider>
