import api from "./api";

export const placeOrder = (data) => {
  return api.post("/user/order", data).then(res => res.data);
};

export const getOrders = () => {
  return api.get("/user/orders").then(res => res.data);
};
