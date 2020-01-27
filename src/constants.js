const localhost = "http://127.0.0.1:8000";

const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;

export const productListURL = `${endpoint}/products/`;
export const productDetailURL = slug => `${endpoint}/products/${slug}/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const countryListURL = `${endpoint}/countries/`;
export const userIDURL = `${endpoint}/user-id/`;
export const addressListURL = addressType =>
  `${endpoint}/addresses/?address_type=${addressType}`;
export const addressCreateURL = `${endpoint}/addresses/create/`;
export const addressUpdateURL = id => `${endpoint}/addresses/${id}/update/`;
export const addressDeleteURL = id => `${endpoint}/addresses/${id}/delete/`;
export const orderItemDeleteURL = id => `${endpoint}/order-items/${id}/delete/`;
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`;
export const paymentListURL = `${endpoint}/payments/`;
export const orderListURL = `${endpoint}/orders/`;

export const membershipListURL = `${endpoint}/membership/`;
export const playListURL = `${endpoint}/play/`;
export const playDetailURL = slug => `${endpoint}/play/${slug}/`;

export const spendTicketsURL = (id, count) =>
  `${endpoint}/update-tickets/${id}/${count}`;

export const profileSummaryURL = `${endpoint}/profile-summary/`;

export const contestEntriesURL = `${endpoint}/entries/create/`;
export const videoListURL = `${endpoint}/videos/`;
export const videoDetailURL = slug => `${endpoint}/videos/${slug}/`;
export const videoUploadURL = slug => `${endpoint}/videos/upload/`;
