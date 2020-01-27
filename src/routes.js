import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import ProductList from "./containers/ProductList";
import ProductDetail from "./containers/ProductDetail";
import OrderSummary from "./containers/OrderSummary";
import TicketSummary from "./containers/TicketSummary";
import Checkout from "./containers/Checkout";
import Profile from "./containers/Profile";
import VideoList from "./containers/VideoList";
import VideoDetail from "./containers/VideoDetail";
import PlayList from "./containers/PlayList";
import PlayDetail from "./containers/PlayDetail";
import Membership from "./containers/Membership";
import VideoUpload from "./containers/VideoUpload";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/products" component={ProductList} />
    <Route path="/products/:slug" component={ProductDetail} />
    <Route exact path="/videos" component={VideoList} />
    <Route path="/videos/:slug" component={VideoDetail} />
    <Route path="/videos/upload" component={VideoUpload} />
    <Route exact path="/play" component={PlayList} />
    <Route path="/play/:slug" component={PlayDetail} />

    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/ticket-summary" component={TicketSummary} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/profile" component={Profile} />

    <Route path="/membership" component={Membership} />
    <Route exact path="/" component={VideoList} />
  </Hoc>
);

export default BaseRouter;
