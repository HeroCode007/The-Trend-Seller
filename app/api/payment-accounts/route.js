import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const method = searchParams.get('method');

        // Validate payment method
        const validMethods = ['jazzcash', 'easypaisa', 'bank'];
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
            easypaisa: {
                accountName: process.env.EASYPAISA_ACCOUNT_NAME || 'Syed Irfan Shah',
                accountNumber: process.env.EASYPAISA_ACCOUNT_NUMBER || '0315-1787031',
                title: 'EasyPaisa Account',
                icon: '💳',
                color: 'bg-green-50 border-green-200',
                textColor: 'text-green-800',
            },
            bank: {
                accountName: process.env.BANK_ACCOUNT_NAME || 'Syed Khizar Hasnain',
                accountNumber: process.env.BANK_ACCOUNT_NUMBER || '3651301000000670',
                bankName: process.env.BANK_NAME || 'Faysal Bank',
                title: 'Bank Transfer',
                icon: '🏦',
                color: 'bg-yellow-50 border-yellow-200',
                textColor: 'text-yellow-800',
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