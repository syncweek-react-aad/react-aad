import * as React from 'react';
import { AzureAD, LoginType } from 'react-aad-msal';

class SampleAppRedirectOnLaunch extends React.Component {
  constructor(props) {
    super(props);

    this.interval = null;
    let redirectEnabled = localStorage.getItem("redirectEnabled") || false;
    this.state = {
      counter: 5,
      redirectEnabled: redirectEnabled
    }
  }

  handleCheck = () => {
    this.setState({ redirectEnabled: !this.state.redirectEnabled }, () => {
      if (!this.state.redirectEnabled) {
        this.clearRedirectInterval();
      } else {
        localStorage.setItem("redirectEnabled", true);
      }
    });
  }

  unauthenticatedFunction = loginFunction => {
    if (this.state.redirectEnabled && !this.interval) {
      this.interval = setInterval(() => {
        if (this.state.counter > 0) {
          this.setState({ counter: this.state.counter - 1 });
        } else {
          this.clearRedirectInterval();
          this.setState({ redirectEnabled: false });
          loginFunction();
        }
      }, 1000);
    }
    
    if (this.state.redirectEnabled) {
      return (<div>Redirecting in {this.state.counter} seconds...</div>);
    }
    
    return (<div />);
  };

  clearRedirectInterval() {
    clearInterval(this.interval);
    this.setState({ counter: 5 });
    localStorage.removeItem("redirectEnabled");
    this.interval = null;
  }

  userJustLoggedIn = receivedUserInfo => {
    this.props.userInfoCallback(receivedUserInfo);
  }

  authenticatedFunction = logout => {
    return (<div><button onClick={() => {
      logout();
    }} className="Button">Logout</button></div>);
  }

  render() {
    return (
      <div>
        {!this.props.userInfo?
          <div>
            <input type="checkbox" value={this.state.redirectEnabled} onChange={this.handleCheck} /> Enable redirect
          </div> : <div/>}
        <AzureAD
          clientID={process.env.REACT_APP_AAD_APP_CLIENT_ID}
          scopes={["openid"]}
          authority={process.env.REACT_APP_AUTHORITY}
          type={LoginType.Redirect}
          unauthenticatedFunction={this.unauthenticatedFunction}
          userInfoCallback={this.userJustLoggedIn}
          authenticatedFunction={this.authenticatedFunction} />
      </div>
    );
  }
}

export default SampleAppRedirectOnLaunch;