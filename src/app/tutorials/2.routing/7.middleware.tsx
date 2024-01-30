//Middleware
//Middleware allows you to run code before a request is completed.
//Use the file middleware.ts (or .js) in the root of your project to define Middleware

import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/about/:path*", "/dashboard/:path*"], //support regex
};
//The matcher values need to be constants
//You can also ignore prefetches (from next/link) that don't need to go through the Middleware using the missing array
export const config1 = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};

//Conditional Statements
export function middleware1(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/about")) {
		return NextResponse.rewrite(new URL("/about-2", request.url));
	}

	if (request.nextUrl.pathname.startsWith("/dashboard")) {
		return NextResponse.rewrite(new URL("/dashboard/user", request.url));
	}
}

/* 
The NextResponse API allows you to:
redirect the incoming request to a different URL
rewrite the response by displaying a given URL
Set request headers for API Routes, getServerSideProps, and rewrite destinations
Set response cookies
Set response headers
*/

//cookies
export function middleware2(request: NextRequest) {
	// Assume a "Cookie:nextjs=fast" header to be present on the incoming request
	// Getting cookies from the request using the `RequestCookies` API
	let cookie = request.cookies.get("nextjs");
	console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
	const allCookies = request.cookies.getAll();
	console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

	request.cookies.has("nextjs"); // => true
	request.cookies.delete("nextjs");
	request.cookies.has("nextjs"); // => false

	// Setting cookies on the response using the `ResponseCookies` API
	const response = NextResponse.next();
	response.cookies.set("vercel", "fast");
	response.cookies.set({
		name: "vercel",
		value: "fast",
		path: "/",
	});
	cookie = response.cookies.get("vercel");
	console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
	// The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.

	return response;
}

//setting headers
export function middleware3(request: NextRequest) {
	// Clone the request headers and set a new header `x-hello-from-middleware1`
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-hello-from-middleware1", "hello");

	// You can also set request headers in NextResponse.rewrite
	const response = NextResponse.next({
		request: {
			// New request headers
			headers: requestHeaders,
		},
	});

	// Set a new response header `x-hello-from-middleware2`
	response.headers.set("x-hello-from-middleware2", "hello");
	return response;
}

//Producing a Response
// Limit the middleware to paths starting with `/api/`
export const config2 = {
	matcher: "/api/:function*",
};

export function middleware4(request: NextRequest) {
	// Call our authentication function to check the request
	/*  if (!isAuthenticated(request)) {
    // Respond with JSON indicating an error message
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  } */
}

//waitUntil and NextFetchEvent
//The waitUntil() method takes a promise as an argument, and extends the lifetime of the Middleware until the promise settles
export function middleware5(req: NextRequest, event: NextFetchEvent) {
	event.waitUntil(
		fetch("https://my-analytics-platform.com", {
			method: "POST",
			body: JSON.stringify({ pathname: req.nextUrl.pathname }),
		})
	);

	return NextResponse.next();
}

//skipTrailingSlashRedirect
//disables Next.js redirects for adding or removing trailing slashes.

//in next.config.js
module.exports = {
	skipTrailingSlashRedirect: true,
};
//in middleware.js
const legacyPrefixes = ["/docs", "/blog"];

export async function middleware6(req: any) {
	const { pathname } = req.nextUrl;

	if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
		return NextResponse.next();
	}

	// apply trailing slash handling
	if (!pathname.endsWith("/") && !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)) {
		req.nextUrl.pathname += "/";
		return NextResponse.redirect(req.nextUrl);
	}
}

//skipMiddlewareUrlNormalize
//disabling the URL normalization in Next.js to make handling direct visits and client-transitions the same.

//in next.config.js
module.exports = {
	skipMiddlewareUrlNormalize: true,
};

//in middleware.js
export async function middleware7(req: any) {
	const { pathname } = req.nextUrl;
	// GET /_next/data/build-id/hello.json
	console.log(pathname);
	// with the flag this now /_next/data/build-id/hello.json
	// without the flag this would be normalized to /hello
}
