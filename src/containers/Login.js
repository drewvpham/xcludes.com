import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authLogin } from "../store/actions/auth";

class LoginForm extends React.Component {
  state = {
    username: "",
    password: "",
    formError: null
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value, formError: null });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    if (username !== "" && password !== "") {
      this.props.login(username, password);
    } else {
      this.setState({
        formError: "Please enter all the form fields"
      });
    }
  };

  render() {
    const { error, loading, token } = this.props;
    const { username, password, formError } = this.state;
    if (token) {
      return <Redirect to="/" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center"></Header>
          {formError && (
            <Message negative>
              <Message.Header>{formError}</Message.Header>
            </Message>
          )}
          {error && (
            <Message negative>
              <Message.Header>{error}</Message.Header>
            </Message>
          )}

          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={username}
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                />
                <Form.Input
                  onChange={this.handleChange}
                  fluid
                  value={password}
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              <Icon name="warning circle" />
              Don''t have an account? <NavLink to="/signup">Register</NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => dispatch(authLogin(username, password))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
