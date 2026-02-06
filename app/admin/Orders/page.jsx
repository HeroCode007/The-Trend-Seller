'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Eye, Loader2, ShoppingCart, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (data.success) setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            processing: 'bg-blue-100 text-blue-700 border-blue-200',
            shipped: 'bg-purple-100 text-purple-700 border-purple-200',
            delivered: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            awaiting_verification: 'bg-blue-100 text-blue-700 border-blue-200',
            paid: 'bg-green-100 text-green-700 border-green-200',
            failed: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getPaymentMethodLabel = (method) => {
        const labels = { 'cod': 'COD', 'jazzcash': 'JazzCash', 'easypaisa': 'EasyPaisa', 'bank-transfer': 'Bank Transfer' };
        return labels[method] || method;
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shippingAddress?.phone?.includes(searchQuery) ||
            order.shippingAddress?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
                    <p className="text-neutral-500 mt-1">{orders.length} total orders</p>
                </div>
                <button onClick={fetchOrders} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search orders, customers, phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="appearance-none px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer">
                            <option value="all">All Payments</option>
                            <option value="pending">Pending</option>
                            <option value="awaiting_verification">Awaiting Verification</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-neutral-500">No orders found</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-neutral-100">
                            {filteredOrders.map((order) => (
                                <Link key={order.orderNumber} href={`/admin/orders/${order.orderNumber}`} className="block p-4 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-semibold text-neutral-900">{order.orderNumber}</span>
                                            <span className="text-xs text-neutral-400 ml-2">{getPaymentMethodLabel(order.paymentMethod)}</span>
                                        </div>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{order.shippingAddress?.fullName}</p>
                                            <p className="text-xs text-neutral-500">{order.shippingAddress?.phone} · {order.shippingAddress?.city}</p>
                                        </div>
                                        <span className="font-semibold text-neutral-900">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items?.length || 0} items
                                        </span>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 border-b border-neutral-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Order</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Items</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Payment</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.orderNumber} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <Link href={`/admin/orders/${order.orderNumber}`} className="font-semibold text-neutral-900 hover:text-amber-600">{order.orderNumber}</Link>
                                                <p className="text-xs text-neutral-500 mt-0.5">{getPaymentMethodLabel(order.paymentMethod)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-neutral-900">{order.shippingAddress?.fullName}</p>
                                                <p className="text-sm text-neutral-500">{order.shippingAddress?.phone}</p>
                                                <p className="text-xs text-neutral-400">{order.shippingAddress?.city}</p>
                                            </td>
                                            <td className="px-6 py-4"><span className="text-neutral-900">{order.items?.length || 0} items</span></td>
                                            <td className="px-6 py-4"><span className="font-semibold text-neutral-900">{formatCurrency(order.totalAmount)}</span></td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                <p className="text-xs text-neutral-400">{new Date(order.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/admin/orders/${order.orderNumber}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" /> View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
