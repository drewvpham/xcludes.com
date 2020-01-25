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

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/products" component={ProductList} />
    <Route path="/products/:slug" component={ProductDetail} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/ticket-summary" component={TicketSummary} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/profile" component={Profile} />
    <Route path="/videos" component={VideoList} />

    <Route path="/play/:slug" component={PlayDetail} />
    <Route path="/play" component={PlayList} />
    <Route path="/membership" component={Membership} />
    <Route exact path="/" component={VideoList} />
    <Route exact path="/videos" component={VideoList} />
    <Route path="/videos/:slug" component={VideoDetail} />
  </Hoc>
);

export default BaseRouter;
