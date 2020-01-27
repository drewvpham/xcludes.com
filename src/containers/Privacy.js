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

class Privacy extends React.Component {
  state = {
    loading: false
  };

  componentDidMount() {
    this.handleFetchContest();
  }

  render() {
    const { data } = this.state;

    return <Container
    </Container>;
  }
}

export default Privacy;
