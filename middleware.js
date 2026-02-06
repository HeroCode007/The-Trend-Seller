import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_token';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow the login page and auth API routes through
    if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) {
        return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        return handleUnauthorized(request, pathname);
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        return handleUnauthorized(request, pathname);
    }
}

function handleUnauthorized(request, pathname) {
    // API routes get a 401 JSON response
    if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Page routes get redirected to login
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
