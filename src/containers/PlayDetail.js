import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Label,
  List,
  Loader,
  Message,
  Segment,
  Select,
  Divider
} from "semantic-ui-react";
import { playDetailURL, contestEntryURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { fetchProfile } from "../store/actions/profile";
import { authAxios } from "../utils";

class PlayDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    data: [],
    formData: {}
  };

  componentDidMount() {
    this.handleFetchContest();
  }

  handleContestEntry = (slug, numEntries, ticketCost) => {
    this.setState({ loading: true });
    // const numEntries = numEntries;
    authAxios
      .post(contestEntryURL, { slug, numEntries, ticketCost })
      .then(res => {
        this.props.refreshProfile();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFetchContest = () => {
    const {
      match: { params }
    } = this.props;

    this.setState({ loading: true });
    axios
      .get(playDetailURL(params.slug))
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, error, loading } = this.state;

    const one_entry = 1;
    const cost_one = 1;
    const cost_five = 5;
    const six_entries = 6;

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
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Card
                fluid
                image={data.image}
                header={data.title}
                description={data.description}
              />

              <Divider />
              <Form>
                <Form.Button
                  basic
                  color="green"
                  onClick={() =>
                    this.handleContestEntry(data.slug, one_entry, cost_one)
                  }
                >
                  1 Entry (1 Token)
                </Form.Button>
                <Form.Button
                  basic
                  color="red"
                  onClick={() =>
                    this.handleContestEntry(data.slug, six_entries, cost_five)
                  }
                >
                  6 Entries (5 Tokens)
                </Form.Button>
              </Form>
            </Grid.Column>
            <Grid.Column>
              <Header as="h2">Entries</Header>

              <List>
                <List.Item>
                  <Image
                    avatar
                    src="https://react.semantic-ui.com/images/avatar/small/rachel.png"
                  />

                  <List.Content>
                    <List.Header as="a">Rachel</List.Header>
                    <List.Description>
                      Last seen watching
                      <a>
                        <b>Arrested Development</b>
                      </a>
                      just now.
                    </List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshProfile: () => dispatch(fetchProfile())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PlayDetail);
