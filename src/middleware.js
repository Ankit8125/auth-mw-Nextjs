import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export function middleware(request){
    const path = request.nextUrl.pathname
    const checkPublicPath = path === '/sign-in' || path === '/sign-up'
    const getCookies = cookies()
    const token = getCookies.get('token')?.value || ''

    if(checkPublicPath && token !== ''){ // means we are on public path and the user is authenticated, so we redirect him to home page
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if(!checkPublicPath && token === ''){
        return NextResponse.redirect(new URL('/sign-in', request.nextUrl))
    }
}

export const config = { // name must be 'config'
    matcher: ['/sign-in', '/sign-up'] // means the middleware must act on this URL's
}