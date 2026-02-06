'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShoppingCart,
    Package,
    DollarSign,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ArrowUpRight,
    Loader2
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/admin/orders?limit=5')
            ]);

            const statsData = await statsRes.json();
            const ordersData = await ordersRes.json();

            if (statsData.success) setStats(statsData.stats);
            if (ordersData.success) setRecentOrders(ordersData.orders || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700',
            processing: 'bg-blue-100 text-blue-700',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700',
            awaiting_verification: 'bg-blue-100 text-blue-700',
            paid: 'bg-green-100 text-green-700',
            failed: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    const statCards = [
        { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-500', lightColor: 'bg-blue-50' },
        { title: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-500', lightColor: 'bg-green-50' },
        { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-purple-500', lightColor: 'bg-purple-50' },
        { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'bg-amber-500', lightColor: 'bg-amber-50' }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
                <p className="text-neutral-500 mt-1">Welcome to your admin panel</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Status</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-yellow-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-700">Pending</span>
                            </div>
                            <p className="text-2xl font-bold text-yellow-900">{stats?.ordersByStatus?.pending || 0}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Package className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Processing</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">{stats?.ordersByStatus?.processing || 0}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Truck className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">Shipped</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-900">{stats?.ordersByStatus?.shipped || 0}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Delivered</span>
                            </div>
                            <p className="text-2xl font-bold text-green-900">{stats?.ordersByStatus?.delivered || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Status</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-yellow-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-700">Pending</span>
                            </div>
                            <p className="text-2xl font-bold text-yellow-900">{stats?.paymentsByStatus?.pending || 0}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Awaiting</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">{stats?.paymentsByStatus?.awaiting_verification || 0}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Paid</span>
                            </div>
                            <p className="text-2xl font-bold text-green-900">{stats?.paymentsByStatus?.paid || 0}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-700">Failed</span>
                            </div>
                            <p className="text-2xl font-bold text-red-900">{stats?.paymentsByStatus?.failed || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-neutral-500">No orders yet</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-neutral-200">
                            {recentOrders.map((order) => (
                                <Link key={order.orderNumber} href={`/admin/orders/${order.orderNumber}`} className="block p-4 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-neutral-900">{order.orderNumber}</span>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-neutral-600">{order.shippingAddress?.fullName}</span>
                                        <span className="font-medium text-neutral-900">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-500">{new Date(order.createdAt).toLocaleDateString('en-PK')}</span>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Payment</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order.orderNumber} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <Link href={`/admin/orders/${order.orderNumber}`} className="font-medium text-neutral-900 hover:text-amber-600">
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-neutral-900">{order.shippingAddress?.fullName}</p>
                                                <p className="text-sm text-neutral-500">{order.shippingAddress?.phone}</p>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-neutral-900">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-PK')}
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
