import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Icon,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import { fetchProfile } from "../store/actions/profile";

class CustomLayout extends React.Component {
  componentDidMount() {
    this.props.fetchProfile();
    this.props.fetchCart();
  }

  render() {
    const {
      authenticated,
      cart,
      profile,
      loading,
      ticket_loading
    } = this.props;

    return (
      <div>
        <Menu borderless size="mini">
          <Container>
            <Link to="/">
              <Menu.Item header>Videos </Menu.Item>
            </Link>
            <Link to="/membership">
              <Menu.Item header>Premium</Menu.Item>
            </Link>
            <Link to="/products">
              <Menu.Item header>Shop</Menu.Item>
            </Link>
            <Link to="/play">
              <Menu.Item header>Play</Menu.Item>
            </Link>

            {authenticated ? (
              <React.Fragment>
                <Menu.Menu position="right">
                  <Dropdown
                    icon="cart"
                    loading={loading}
                    text={`${
                      cart !== null
                        ? cart.order_items.reduce(
                            (a, { quantity }) => a + quantity,
                            0
                          )
                        : 0
                    }`}
                    pointing
                    className="link item"
                  >
                    <Dropdown.Menu>
                      {cart !== null ? (
                        <React.Fragment header>
                          {cart.order_items.map(order_item => {
                            return (
                              <Dropdown.Item key={order_item.id}>
                                {order_item.quantity} x {order_item.item.title}
                              </Dropdown.Item>
                            );
                          })}
                          {cart.order_items.length < 1 ? (
                            <Dropdown.Item>No items in your cart</Dropdown.Item>
                          ) : null}
                          <Dropdown.Divider />

                          <Dropdown.Item
                            icon="arrow right"
                            text="Checkout"
                            onClick={() =>
                              this.props.history.push("/order-summary")
                            }
                          />
                        </React.Fragment>
                      ) : (
                        <Dropdown.Item>No items in your cart</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>

                  <Link to="/play" icon="chart line">
                    <Menu.Item
                      header
                      loading={ticket_loading}
                      content={`${profile !== null ? profile.tickets : 0}`}
                      icon="ticket"
                    ></Menu.Item>
                  </Link>
                  <Link to="/profile">
                    <Menu.Item header>Profile</Menu.Item>
                  </Link>
                  <Menu.Item header onClick={() => this.props.logout()}>
                    Logout
                  </Menu.Item>
                </Menu.Menu>
              </React.Fragment>
            ) : (
              <Menu.Menu position="right">
                <Link to="/login">
                  <Menu.Item header>Login</Menu.Item>
                </Link>
                <Link to="/signup">
                  <Menu.Item header>Signup</Menu.Item>
                </Link>
              </Menu.Menu>
            )}
          </Container>
        </Menu>

        {this.props.children}

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Company" />
                <List link inverted>
                  <List.Item as="a">Contact us</List.Item>
                  <List.Item as="a">Support</List.Item>
                  <List.Item as="a">Content Partnership</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Social" />
                <List link inverted>
                  <List.Item as="a">Twitter</List.Item>
                  <List.Item
                    as="a"
                    href="https://www.instagram.com/xcludesofficial/"
                  >
                    Instagram
                  </List.Item>
                  <List.Item
                    as="a"
                    href="https://reddit.com/user/XcludesOfficial"
                  >
                    Reddit
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Information" />
                <List link inverted>
                  <List.Item as="a">Privacy policy</List.Item>
                  <List.Item as="a">Terms & Conditions</List.Item>
                  <List.Item as="a">Content Removal/DMCA</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header inverted as="h4" content="Xcludes" />
                <p>Just the stuff you want</p>
              </Grid.Column>
            </Grid>

            <Divider inverted section />
            <Image centered size="mini" src="/logo.png" />
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    profile: state.profile.userProfile,
    loading: state.cart.loading,
    ticket_loading: state.profile.ticket_loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart()),
    fetchProfile: () => dispatch(fetchProfile())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
