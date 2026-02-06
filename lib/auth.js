import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_token';
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken() {
    return await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET);
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch {
        return null;
    }
}

export { COOKIE_NAME };
