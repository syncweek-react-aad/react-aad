import * as React from 'react';
import { AzureAD, LoginType } from 'react-aad-msal';
import { basicReduxStore } from './reduxStore';

class SampleAppButtonLaunch extends React.Component {
    unauthenticatedFunction = loginFunction => {
        return (
            <button className="Button" onClick={loginFunction}>Login</button>
        );
    }

    userJustLoggedIn = receivedUserInfo => {
        this.props.userInfoCallback(receivedUserInfo);
    }

    authenticatedFunction = (logout) => {
        return (<div>
            You're logged in!
            <br />
            <br />
            <button onClick={logout} className="Button">Logout</button>
            <br />
        </div>) ;
    }

    render() {
        return (
            <AzureAD
                clientID={process.env.REACT_APP_AAD_APP_CLIENT_ID}
                scopes={["openid"]}
                authority={process.env.REACT_APP_AUTHORITY}
                type={LoginType.Popup}
                unauthenticatedFunction={this.unauthenticatedFunction}
                userInfoCallback={this.userJustLoggedIn}
                reduxStore={basicReduxStore}
                authenticatedFunction={this.authenticatedFunction} />
        );
    }
}

export default SampleAppButtonLaunch;
