//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import * as React from 'react';

export default function GetTokenButton({ provider }) {
  const authProvider = provider.getAuthProvider();

  const getAuthToken = () => {
    // You should should use getToken() to fetch a fresh token before making API calls
    authProvider.getAccessToken().then(response => {
      alert(response.accessToken);
    });
  };

  return (
    <React.Fragment>
      <p>
        You can use the auth provider to get a fresh token. If a valid token is in cache it will be returned, otherwise
        a fresh token will be requested. If the request fails, the user will be forced to login again.
      </p>
      <button onClick={getAuthToken} className="Button">
        Get Access Token
      </button>
    </React.Fragment>
  );
}
