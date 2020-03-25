import React, { Component } from 'react';
import Input from '../Input';
import './Login.css';

const PASSWORDS_DONT_MATCH = "Passwords don't match!";

class Login extends Component {
  state = {
    username: this.props.username || '',
    password: this.props.password || '',
    confirm: this.props.confirm || '',
    create: false,
    error: {},
  };
  componentDidMount() {
    document.addEventListener('keydown', this.escFunction.bind(this), false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction.bind(this), false);
  }
  escFunction(event) {
    if (event.keyCode === 27 && this.props.active) {
      this.props.close();
    }
  }
  validations = nextState => {
    const { username, confirm, password } = nextState;
    if (confirm !== password) {
      nextState.error.confirm = PASSWORDS_DONT_MATCH;
    }
    if (
      confirm === password &&
      nextState.error.confirm === PASSWORDS_DONT_MATCH
    ) {
      nextState.error.confirm = '';
    }
    return nextState;
  };
  handleChange = event => {
    const nextState = Object.assign({}, this.state);
    nextState[event.target.name] = event.target.value;
    const state = this.validations(nextState);
    this.setState({ ...state });
  };
  login = async event => {
    if (event) event.preventDefault();
    const { username, password } = this.state;
    const data = { username, password };
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    var message = 'Logged in!';
    if (response.status == 200) {
      this.props.close();
    } else {
      message = 'Request rejected!';
    }
    this.props.showSnackbar(message);
  };
  create = async event => {
    if (event) event.preventDefault();
    const { error, username, confirm, password } = this.state;
    var message = 'Form Errors!';
    if (error.confirm == PASSWORDS_DONT_MATCH) {
      this.props.showSnackbar(message);
      return;
    }
    const data = { username, password };
    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.status == 200) {
      message = 'User created!';
      this.props.close();
    } else {
      message = 'Request rejected!';
    }
    this.props.showSnackbar(message);
  };
  renderCreate() {
    return (
      <form onSubmit={this.create} className="login">
        <a class="icon-close" onClick={this.props.close}>
          x
        </a>
        <Input
          label="Username"
          type="text"
          error={this.state.error.username}
          name="username"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <Input
          label="Password"
          type="password"
          error={this.state.error.password}
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <Input
          label="Confirm "
          type="password"
          error={this.state.error.confirm}
          name="confirm"
          value={this.state.confirm}
          onChange={this.handleChange}
        />
        <div class="input-container">
          <button type="submit">Submit</button>
        </div>
        <div class="input-container">
          <a onClick={this.toggleCreate}>Login</a>
        </div>
      </form>
    );
  }
  renderLogin() {
    return (
      <form onSubmit={this.login} className="login">
        <a class="icon-close" onClick={this.props.close}>
          x
        </a>
        <Input
          label="Username"
          type="text"
          error={this.state.error.username}
          name="username"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <Input
          label="Password"
          type="password"
          error={this.state.error.password}
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <div class="input-container">
          <button type="submit">Login</button>
        </div>
        <div class="input-container">
          <a onClick={this.toggleCreate}>Create new account</a>
        </div>
      </form>
    );
  }
  toggleCreate = () => {
    const { create } = this.state;
    this.setState({ create: !create });
  };
  render() {
    const { active } = this.props;
    const { create } = this.state;
    return (
      <div className={`modal-bg ${active ? 'active' : ''}`}>
        {create ? this.renderCreate() : this.renderLogin()}
      </div>
    );
  }
}
export default Login;
