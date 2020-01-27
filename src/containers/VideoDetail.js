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
  Loader,
  Message,
  Segment,
  Select,
  Divider
} from "semantic-ui-react";
import { videoDetailURL } from "../constants";
import { fetchProfile } from "../store/actions/profile";
import { authAxios } from "../utils";

class VideoDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {}
  };

  handleFetchVideo = () => {
    const {
      match: { params }
    } = this.props;
    this.setState({ loading: true });
    axios
      .get(videoDetailURL(params.slug))
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, error, loading } = this.state;

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
            <Grid.Column>asdfasdfasd</Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default VideoDetail;
