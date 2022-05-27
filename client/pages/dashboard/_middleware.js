import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    if (!req.url.includes('/dashboard')) {
        return NextResponse.next();
    }

    const session = await getToken({
        req,
        secret: process.env.NEXT_PUBLIC_SECRET,
    });

    if (!session) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}sign-in`);
    }

    if (req.url.includes('/dashboard/nurse') && session.role !== 'ROLE_NURSE') {
        return NextResponse.redirect(
            `${process.env.NEXTAUTH_URL}dashboard/family`
        );
    }

    if (
        req.url.includes('/dashboard/family') &&
        session.role !== 'ROLE_PARENT'
    ) {
        return NextResponse.redirect(
            `${process.env.NEXTAUTH_URL}dashboard/nurse`
        );
    }

    return NextResponse.next();
}
