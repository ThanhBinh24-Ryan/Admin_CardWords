import React from 'react';

export default function ProtectedRoute({ children }: React.PropsWithChildren<{}>) {

  return (

    <>
      {children}
    </>
  );
}
