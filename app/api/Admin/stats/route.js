import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { products } from '@/lib/products';

export async function GET() {
    try {
        await connectDB();

        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            { $match: { $or: [{ status: 'delivered' }, { paymentStatus: 'paid' }] } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        const ordersByStatusResult = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
        const ordersByStatus = {};
        ordersByStatusResult.forEach(item => { ordersByStatus[item._id] = item.count; });

        const paymentsByStatusResult = await Order.aggregate([{ $group: { _id: '$paymentStatus', count: { $sum: 1 } } }]);
        const paymentsByStatus = {};
        paymentsByStatusResult.forEach(item => { paymentsByStatus[item._id] = item.count; });

        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const totalProducts = products.length;

        return NextResponse.json({
            success: true,
            stats: { totalOrders, totalRevenue, totalProducts, pendingOrders, ordersByStatus, paymentsByStatus }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
    }
}
