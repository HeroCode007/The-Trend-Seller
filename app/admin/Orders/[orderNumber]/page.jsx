'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminOrderPage({ params }) {
  const { orderNumber } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchOrder() {
      const res = await fetch(`/api/admin/orders/${orderNumber}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
        setStatus(data.order.status);
        setPaymentStatus(data.order.paymentStatus);
      }
      setLoading(false);
    }

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center mt-10">Order not found.</p>;
  }

  async function updateOrder() {
    const res = await fetch(`/api/admin/orders/${orderNumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus }),
    });

    const data = await res.json();

    if (data.success) {
      alert('Order updated!');
      router.refresh();
    } else {
      alert('Update failed.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order.orderNumber}</h1>

      <div className="space-y-4 p-4 border rounded-lg bg-white shadow">
        <h2 className="text-lg font-semibold">Customer Details</h2>

        <p><strong>Address:</strong> {order.shippingAddress}</p>
        <p><strong>Total Amount:</strong> PKR {order.totalAmount}</p>

        <h2 className="text-lg font-semibold mt-6">Items</h2>
        <ul className="list-disc ml-6">
          {order.items.map((item, idx) => (
            <li key={idx}>
              {item.name} — Qty: {item.quantity} — Price: {item.price}
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-6">Update Status</h2>
        <div className="space-y-3">
          <div>
            <label className="font-medium">Order Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded ml-2"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Payment Status:</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="border p-2 rounded ml-2"
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button
            onClick={updateOrder}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Update Order
          </button>
        </div>

        {order.paymentScreenshot && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Payment Screenshot</h2>
            <img
              src={order.paymentScreenshot}
              alt="Payment Screenshot"
              className="border rounded w-72 mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
