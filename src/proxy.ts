import { NextRequest, NextResponse } from 'next/server';
import { getPublicEnvByName } from '@daniel-rose/envex/server'

export async function proxy(request: NextRequest) {

   const adminHost = await getPublicEnvByName('NEXT_PUBLIC_ADMIN_WEB');
    const ticketHost = await getPublicEnvByName('NEXT_PUBLIC_TICKET_WEB');

    const targetPath = request.nextUrl.pathname;
    
    let newPath = '';
    let destinationHost: string = '';

    if (targetPath.startsWith('/admin')) {
        newPath = targetPath.replace('/admin', '') || '/'; 
        destinationHost = adminHost || '/';
    } else if (targetPath.startsWith('/ticket')) {
        newPath = targetPath.replace('/ticket', '') || '/';
        destinationHost = ticketHost || '/';
    } else {
        return NextResponse.next();
    }
    
    const destinationUrl = destinationHost + newPath;    
    return NextResponse.rewrite(destinationUrl);
}

export const config = {
    matcher: ['/admin/:path*', '/ticket/:path*'],
};