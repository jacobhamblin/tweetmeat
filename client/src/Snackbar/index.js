import React from 'react';

import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';

export default function Snackbar({message}) {
  return (
    <SnackbarProvider position="bottom">
      <Container message={message}/>
    </SnackbarProvider>
  );
}

const Container = wrapComponent(function({ createSnackbar }) {
  function showSnackbar() {
    createSnackbar({
      message: 'message',
      dismissable: false,
      pauseOnHover: false,
      progressBar: true,
      sticky: false,
      theme: 'default',
      timeout: 3000
    });
  }

  return (
    <div>
      <button onClick={showSnackbar}>Show Snackbar</button>
    </div>
  );
});
