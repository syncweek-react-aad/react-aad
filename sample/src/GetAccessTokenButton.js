import * as React from 'react';

export default function GetTokenButton({ provider }) {
  const getAuthToken = () => {
    // You should should use getAccessToken() to fetch a fresh token before making API calls
    provider.getAccessToken().then(token => {
      alert(token.accessToken);
    });
  };

  return (
    <div style={{ margin: '40px 0' }}>
      <p>
        You can use the auth provider to get a fresh token. If a valid token is in cache it will be returned, otherwise
        a fresh token will be requested. If the request fails, the user will be forced to login again.
      </p>
      <button onClick={getAuthToken} className="Button">
        Get Access Token
      </button>
    </div>
  );
}
