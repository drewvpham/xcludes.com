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
  data,
  Label,
  Loader,
  List,
  Message,
  Segment,
  Select,
  Divider
} from "semantic-ui-react";
import { playDetailURL, contestEntriesURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { fetchProfile } from "../store/actions/profile";
import { authAxios } from "../utils";

class PlayDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    entries: [],
    formData: {}
  };

  componentDidMount() {
    this.handleFetchContest();
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible
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
        this.setState({
          data: res.data,
          entries: res.data.entries,
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };
  handleContestEntry = (slug, numEntries, ticketCost) => {
    this.setState({ loading: true });

    authAxios
      .post(contestEntriesURL, { slug, numEntries, ticketCost })
      .then(res => {
        this.props.refreshProfile();
        this.handleFetchContest();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, entries, error, formData, formVisible, loading } = this.state;
    const one_entry = 1;
    const cost_one = 1;
    const cost_five = 5;
    const six_entries = 6;

    console.log("entries", entries, typeof entries);

    return (
      <Container>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
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
              <Header as="h2">Contest Entries</Header>
              {loading && (
                <Segment>
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>
                  <Image src="/images/wireframe/short-paragraph.png" />
                </Segment>
              )}
              <List>
                {entries &&
                  entries.map(v => {
                    return (
                      <React.Fragment key={v.id}>
                        <List.Item>
                          <Image
                            avatar
                            src="https://react.semantic-ui.com/images/avatar/small/rachel.png"
                          />

                          <List.Content>
                            <List.Header as="a">{v.user}</List.Header>
                            <List.Description>
                              Last seen watching
                              <a>
                                <b>Arrested Development</b>
                              </a>
                              just now.
                            </List.Description>
                          </List.Content>
                        </List.Item>
                      </React.Fragment>
                    );
                  })}
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
    refreshCart: () => dispatch(fetchCart()),
    refreshProfile: () => dispatch(fetchProfile())
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(PlayDetail)
);
