import React from "react";
import { connect } from "react-redux";
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
import { playListURL, spendTicketsURL } from "../constants";
import { fetchProfile } from "../store/actions/profile";
import { authAxios } from "../utils";

class PlayList extends React.Component {
  state = {
    loading: false,
    error: null,
    formData: {},
    data: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(playListURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

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
          {data.map(contest => {
            return (
              <Card key={contest.id}>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                  />

                  <Card.Header
                    as="a"
                    onClick={() =>
                      this.props.history.push(`/play/${contest.slug}`)
                    }
                  >
                    asdfas
                  </Card.Header>
                  <Card.Description>{contest.title}</Card.Description>
                  <Card.Meta>{contest.entries.length} Entries</Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Button basic color="green" size="tiny">
                      1 Entry (1 Token)
                    </Button>
                    <Button basic color="red">
                      6 Entries (5 Tokens)
                    </Button>
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

const mapDispatchToProps = dispatch => {
  return {
    refreshProfile: () => dispatch(fetchProfile())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PlayList);
