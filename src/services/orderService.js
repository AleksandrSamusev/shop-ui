import api from "../api/axios";

const OrderService = {
  /**
   * 🚀 CREATE: Sends the OrderCreateRequest (addressId + items)
   * Sarah triggers this during the checkout finalization.
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data; // Returns ApiResponse<OrderResponse>
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * 🚀 MY ORDERS: Retrieves the personalized history for the logged-in user.
   */
  getMyOrders: async () => {
    try {
      const response = await api.get("/orders/my-orders");
      return response.data; // Returns ApiResponse<List<OrderResponse>>
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * 🚀 ALL ORDERS (Admin): Alex monitors the global transaction stream.
   */
  getAllOrders: async () => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * 🚀 UPDATE STATUS (Admin): Manages the order lifecycle (e.g., PAID to SHIPPED).
   */
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default OrderService;