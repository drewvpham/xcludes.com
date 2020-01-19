import React from "react";
import axios from "axios";
import {
  Container,
  Dimmer,
  Card,
  Button,
  Loading,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment
} from "semantic-ui-react";
import { membershipListURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import { CardElement } from "react-stripe-elements";

class Membership extends React.Component {
  state = {
    loading: false,
    error: null,
    data: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(membershipListURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  handleAddToCart = slug => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug })
      .then(res => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, loading, error } = this.state;
    return (
      <Container>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        <Card.Group>
          {data.map(membership => {
            return (
              <Card>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                  />
                  <Card.Header>{membership.membership_type}</Card.Header>
                  <Card.Meta>{membership.price}</Card.Meta>
                  <Card.Description>
                    Steve wants to add you to the group{" "}
                    <strong>best friends</strong>
                  </Card.Description>
                  {membership.price === 72 ? (
                    <Label as="a" color="blue" ribbon="right">
                      Best Value
                    </Label>
                  ) : membership.price === 8 ? (
                    <Label as="a" color="orange" ribbon="right">
                      Most Popular
                    </Label>
                  ) : null}
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Button color="yellow">Upgrade</Button>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </Container>
    );
  }
}

export default Membership;
