import React from "react";
import SampleAppButtonLaunch from "./SampleAppButtonLaunch";
import SampleAppRedirectOnLaunch from "./SampleAppRedirectOnLaunch";

export const SampleBox: React.FC<{
  sampleType: string;
}> = ({ sampleType }) =>
  sampleType === "popup" ? (
    <div className="SampleBox">
      <h2 className="SampleHeader">Button Login</h2>
      <p>
        example will launch a popup dialog to allow for authentication with
        Azure Active Directory
      </p>
      <SampleAppButtonLaunch />
    </div>
  ) : (
    <div className="SampleBox">
      <h2 className="SampleHeader">Automatic Redirect</h2>
      <p>
        example shows how you can use the AzureAD component to redirect the reen
        automatically on page load.Click the checkbox below to enable the
        redirect and refresh your browser window.
      </p>
      <SampleAppRedirectOnLaunch />
    </div>
  );
