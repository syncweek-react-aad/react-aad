import * as React from "react";
import { MsalAuthProvider } from "react-aad-msal";

interface Props {
  provider: MsalAuthProvider;
}

const GetTokenButton = ({ provider }: Props) => {
  const getAuthToken = async () => {
    alert((await provider.getIdToken()).idToken.rawIdToken);
  };

  return (
    <div style={{ margin: "40px 0" }}>
      <p>
        It's also possible to renew the IdToken. If a valid token is in the
        cache, it will be returned. Otherwise a renewed token will be requested.
        If the request fails, the user will be forced to login again.
      </p>
      <button onClick={getAuthToken} className="Button">
        Get IdToken
      </button>
    </div>
  );
};

export default GetTokenButton;
