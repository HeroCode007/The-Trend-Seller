import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const method = searchParams.get('method');

        // Validate payment method
        const validMethods = ['jazzcash', 'nayapay'];
        if (!method || !validMethods.includes(method)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid payment method'
            }, { status: 400 });
        }

        // Payment account details from environment variables
        const paymentAccounts = {
            jazzcash: {
                accountName: process.env.JAZZCASH_ACCOUNT_NAME || 'Syed Saif Ali',
                accountNumber: process.env.JAZZCASH_ACCOUNT_NUMBER || '0323-4653567',
                title: 'JazzCash Account',
                icon: '📱',
                color: 'bg-blue-50 border-blue-200',
                textColor: 'text-blue-800',
            },
            nayapay: {
                accountName: process.env.NAYAPAY_ACCOUNT_NAME || 'Syed Saif Ali',
                accountNumber: process.env.NAYAPAY_ACCOUNT_NUMBER || '03234653567',
                title: 'NayaPay Account',
                icon: '💳',
                color: 'bg-green-50 border-green-200',
                textColor: 'text-green-800',
            },
        };

        return NextResponse.json({
            success: true,
            account: paymentAccounts[method]
        });

    } catch (error) {
        console.error('Error fetching payment accounts:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch payment account details'
        }, { status: 500 });
    }
}