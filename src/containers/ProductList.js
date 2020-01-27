import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Form,
  Image,
  Icon,
  // Item,
  // Label,
  Loader,
  Message,
  Segment,
  Select
} from "semantic-ui-react";
import { productListURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
// import { Link } from "react-router-dom";

class ProductList extends React.Component {
  state = {
    loading: false,
    error: null,
    formData: {},
    data: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(productListURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  //added
  handleFormatData = formData => {
    // convert {colour: 1, size: 2} to [1,2] - they're all variations
    return Object.keys(formData).map(key => {
      return formData[key];
    });
  };

  // handleAddToCart = slug => {
  //   this.setState({ loading: true });
  //   authAxios
  //     .post(addToCartURL, { slug })
  //     .then(res => {
  //       this.props.refreshCart();
  //       this.setState({ loading: false });
  //     })
  //     .catch(err => {
  //       this.setState({ error: err, loading: false });
  //     });
  // };

  handleAddToCart = slug => {
    this.setState({ loading: true });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);
    authAxios
      .post(addToCartURL, { slug, variations })
      .then(res => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    this.setState({ formData: updatedFormData });
  };

  render() {
    const { data, error, formData, loading } = this.state;
    return (
      <Container>
        {error && (
          <Message
            error
            header="There was an error with your submission:"
            content={JSON.stringify(error.message)}
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
          {data.map(item => {
            return (
              <Card key={item.slug}>
                <Image
                  src={item.image}
                  wrapped
                  ui={false}
                  as="a"
                  onClick={() =>
                    this.props.history.push(`/products/${item.slug}`)
                  }
                />
                <Card.Content>
                  <Card.Header
                    as="a"
                    onClick={() =>
                      this.props.history.push(`/products/${item.slug}`)
                    }
                  >
                    {item.title}
                  </Card.Header>

                  <Card.Meta>
                    <span>${item.price}</span>
                    <span>
                      {item.discount_price ? (
                        <strike>${item.discount_price}</strike>
                      ) : null}
                    </span>
                  </Card.Meta>
                  <Card.Description>{item.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  {item.variations && (
                    <React.Fragment>
                      <Form onSubmit={() => this.handleAddToCart(item.slug)}>
                        {item.variations.map(v => {
                          const name = v.name.toLowerCase();
                          return (
                            <Form.Field key={v.id}>
                              <Select
                                name={name}
                                onChange={this.handleChange}
                                placeholder={`Select a ${name}`}
                                fluid
                                selection
                                options={v.item_variations.map(item => {
                                  return {
                                    key: item.id,
                                    text: item.value,
                                    value: item.id
                                  };
                                })}
                                value={formData[name]}
                              />
                            </Form.Field>
                          );
                        })}

                        <Form.Button
                          fluid
                          color="yellow"
                          icon
                          labelPosition="right"
                        >
                          Add to Cart
                          <Icon name="cart plus" />
                        </Form.Button>
                      </Form>
                    </React.Fragment>
                  )}
                  <br />
                  <Button fluid icon labelPosition="right" color="orange">
                    Buy now 1 click
                    <Icon name="cart plus" />
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshCart: () => dispatch(fetchCart())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ProductList);
