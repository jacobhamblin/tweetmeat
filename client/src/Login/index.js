import React, { Component } from 'react';
import './Login.css';

class Login extends Component {
  state = {
    username: this.props.username || '',
    password: this.props.password || '',
  };
  componentDidMount() {}
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  login = async event => {
    if (event) event.preventDefault();
    const { username, password } = this.state;
    const data = { username, password };
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    var message = 'Logged in!'
    if (response.status == 200) {
      this.props.close()
    } else {
      message = 'Form errors!'
    }
    this.props.showSnackbar(message);
  };
  render() {
    const { active } = this.props;
    return (
      <div className={`modal-bg ${active ? 'active' : ''}`}>
        <form onSubmit={this.login} className='login'>
          <a class="icon-close" onClick={this.props.close}>x</a>
          <div class="input-container">
            <label for="username">Username</label>
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
          <div class="input-container">
            <label for="password">Password</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div class="input-container">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
export default Login;
