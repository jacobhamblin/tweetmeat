import React, { Component } from 'react';
import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';
import Homepage from './Homepage';

const Container = wrapComponent(function({ children, createSnackbar }) {
  function showSnackbar(message) {
    createSnackbar({
      message,
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
      {React.cloneElement(children, { showSnackbar, })}
    </div>
  )
});

class App extends Component {
  render() {
    return (
      <SnackbarProvider>
        <Container>
          <Homepage/>
        </Container>
      </SnackbarProvider>
    );
  }
}
export default App;
