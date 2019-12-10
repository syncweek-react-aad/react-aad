import * as React from 'react';

export default function GetTokenButton({ provider }) {
  const getAuthToken = () => {
    provider.getIdToken().then(token => {
      alert(token.idToken.rawIdToken);
    });
  };

  return (
    <div style={{ margin: '40px 0' }}>
      <p>
        It's also possible to renew the IdToken. If a valid token is in the cache, it will be returned. Otherwise a
        renewed token will be requested. If the request fails, the user will be forced to login again.
      </p>
      <button onClick={getAuthToken} className="Button">
        Get IdToken
      </button>
    </div>
  );
}
