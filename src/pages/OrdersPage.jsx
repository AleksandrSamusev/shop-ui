import { useEffect, useState } from "react";
import OrderService from "../services/orderService";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await OrderService.getMyOrders();

                // 🔍 IMPORTANT: your API wraps data inside "data"
                setOrders(response.data || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "text-yellow-400";
            case "PAID":
                return "text-emerald-400";
            case "SHIPPED":
                return "text-blue-400";
            case "DELIVERED":
                return "text-purple-400";
            case "CANCELLED":
                return "text-red-400";
            default:
                return "text-slate-400";
        }
    };

    // 🛡️ LOADING STATE
    if (loading) {
        return (
            <div className="text-white">
                <p className="text-sm">Loading orders...</p>
            </div>
        );
    }

    // 🛡️ EMPTY STATE
    if (orders.length === 0) {
        return (
            <div className="text-white">
                <p className="text-sm">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                My Orders
            </h1>

            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">
                                Reference
                            </p>
                            <p className="text-sm font-bold text-white">
                                {order.referenceCode}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">
                                Status
                            </p>
                            <p className={`text-sm font-bold ${getStatusColor(order.status)}`}>
                                {order.status}
                            </p>
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div className="space-y-2">
                        {order.items?.map((item) => (
                            <div
                                key={`${order.id}-${item.productName}`}
                                className="flex justify-between text-sm text-slate-300"
                            >
                                <span>
                                    {item.productName} x {item.quantity}
                                </span>
                                <span>
                                    ${item.totalPrice?.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-between mt-4 pt-4 border-t border-slate-800">
                        <span className="text-xs text-slate-500 uppercase">
                            Total
                        </span>
                        <span className="text-lg font-bold text-white">
                            ${order.totalPrice?.toLocaleString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}