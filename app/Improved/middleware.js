import { NextResponse } from 'next/server';

/**
 * Middleware for performance monitoring and optimization
 * Add to middleware.js in your project root
 */
export function middleware(request) {
    const startTime = Date.now();
    const response = NextResponse.next();
    
    // Add timing header for debugging
    response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
}

export const config = {
    matcher: [
        '/api/:path*',
    ],
};
