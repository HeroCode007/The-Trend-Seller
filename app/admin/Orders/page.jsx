'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('/api/admin/orders')
            .then((res) => res.json())
            .then((data) => setOrders(data.orders || []));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">All Orders</h1>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Order #</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Payment</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderNumber}>
                            <td className="p-2 border">{order.orderNumber}</td>
                            <td className="p-2 border">PKR {order.totalAmount}</td>
                            <td className="p-2 border">{order.status}</td>
                            <td className="p-2 border">{order.paymentStatus}</td>
                            <td className="p-2 border">
                                <Link
                                    className="text-blue-600 underline"
                                    href={`/admin/orders/${order.orderNumber}`}
                                >
                                    View / Update
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
