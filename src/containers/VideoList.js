import React from "react";
import axios from "axios";
import {
  Container,
  Menu,
  Dimmer,
  Card,
  Button,
  Loading,
  Image,
  Input,
  Item,
  Label,
  Loader,
  Message,
  Segment
} from "semantic-ui-react";
import { membershipListURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import VideoFilter from "./VideoFilter";
import { videoListURL } from "../constants";
class VideoList extends React.Component {
  state = {
    loading: false,
    error: null,
    formData: {},
    activeItem: "home",
    data: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(videoListURL)
      .then(res => {
        console.log(res.data, "video list data");
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem, data } = this.state;

    return (
      <Container>
        <Menu secondary size="mini">
          <Menu.Item
            icon="chart line"
            name="Popular"
            active={activeItem === "home"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="bolt"
            name="New"
            active={activeItem === "messages"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="tasks"
            name="Recommended"
            active={activeItem === "friends"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="random"
            name="Random"
            active={activeItem === "friends"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="th"
            name="Categories"
            active={activeItem === "logout"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="star"
            name="Pornstars"
            active={activeItem === "logout"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            icon="window close"
            name="Excluded"
            active={activeItem === "logout"}
            onClick={this.handleItemClick}
          />
          <Menu.Menu position="right">
            <Menu.Item>
              <VideoFilter />
            </Menu.Item>
          </Menu.Menu>
          <Menu.Menu position="right">
            <Menu.Item>
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Menu secondary size="mini">
          <Menu.Item
            name="Today"
            active={activeItem === "home"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Week"
            active={activeItem === "messages"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Month"
            active={activeItem === "friends"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Year"
            active={activeItem === "friends"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="All Time"
            active={activeItem === "logout"}
            onClick={this.handleItemClick}
          />
        </Menu>
      </Container>
    );
  }
}

export default VideoList;
