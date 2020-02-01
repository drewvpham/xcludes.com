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

class UserDetail extends React.Component {
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
        const newEntries = res.data.entries;
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
    const { error } = this.state;
    return (
      <Container>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
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
  )(UserDetail)
);
