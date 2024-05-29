import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = new URL(request.url);

    if (token &&
        (
            url.pathname.startsWith("/sign-in") ||
            url.pathname.startsWith("/sign-up") ||
            url.pathname.startsWith("/verify") ||
            url.pathname === "/"
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url).toString());
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
};
