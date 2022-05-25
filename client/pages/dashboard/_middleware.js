import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    if (!req.url.includes('/dashboard')) {
        return NextResponse.next();
    }

    const session = await getToken({
        req,
        secret: process.env.NEXT_PUBLIC_BASE_URL,
    });

    if (!session) {
        return NextResponse.redirect('http://localhost:3000/sign-in');
    }

    if (req.url.includes('/dashboard/nurse') && session.role !== 'ROLE_NURSE') {
        return NextResponse.redirect('http://localhost:3000/dashboard/family');
    }

    if (
        req.url.includes('/dashboard/family') &&
        session.role !== 'ROLE_PARENT'
    ) {
        return NextResponse.redirect('http://localhost:3000/dashboard/nurse');
    }

    return NextResponse.next();
}
