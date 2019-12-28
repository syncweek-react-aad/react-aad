import * as React from 'react';

import { AzureAD, IAzureADProps } from './AzureAD';

export const withAuthentication = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  parameters: IAzureADProps,
): React.FunctionComponent<P> => {
  // tslint:disable-next-line: no-shadowed-variable
  const withAuthentication: React.FunctionComponent = (props: any) => {
    const propParams: IAzureADProps = { forceLogin: true, ...parameters };

    withAuthentication.displayName = `withAuthentication(${WrappedComponent.displayName || WrappedComponent.name}`;
    return (
      <AzureAD {...propParams}>
        <WrappedComponent {...props} />
      </AzureAD>
    );
  };

  return withAuthentication;
};
