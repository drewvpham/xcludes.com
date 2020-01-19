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

class VideoList extends React.Component {
  state = { activeItem: "home" };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

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
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Container>
    );
  }
}

export default VideoList;
