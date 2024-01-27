/* Link component

*/

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Page() {
	const pathname = usePathname();

	return (
		<>
			<Link href="/dashboard">Dashboard</Link>
			{/* disabling forward backwards scroll behavior */}
			<Link href="/dashboard" scroll={false}></Link>
			{/* out of navigation history */}
			<Link href="/dashboard" replace={false}></Link>
			{/* do not prefetch the page */}
			<Link href="/dashboard" prefetch={false}></Link>
			{/* scrolling to the settings section */}
			<Link href="/dashboard#settings">Settings</Link>
			<Link className={`link ${pathname === "/about" ? "active" : ""}`} href="/about">
				Home
			</Link>
		</>
	);
}

//redirects
/*
redirect  ====> 	Redirect user after a mutation or event - in Server Components, Server Actions, Route Handlers	307 (Temporary) or 303 (Server Action)
permanentRedirect ====>	Redirect user after a mutation or event	Server in Components, Server Actions, Route Handlers	308 (Permanent)
useRouter ====>	Perform a client-side navigation Event Handlers in Client Components	N/A
redirects in next.config.js ====>	Redirect an incoming request based on a path - in next.config.js file	307 (Temporary) or 308 (Permanent)
NextResponse.redirect ====>	Redirect an incoming request based on a condition - inMiddleware	Any

*/

/* redirect and permanentRedirect 
307 (Temporary Redirect) status code by default
in a Server Action, it returns a 303 (See Other) commonly used for redirecting to a success page as a result of a POST request.
redirect can be called in Client Components during the rendering process but not in event handlers
permanentRedirect returns a 308 (permanent redirect) status code by default
If you'd like to redirect before the render process, use next.config.js or Middleware.

*/
("use server");
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(id: string) {
	try {
		// Call database
	} catch (error) {
		// Handle errors
	}

	revalidatePath("/posts"); // Update cached posts
	redirect(`/post/${id}`); // Navigate to the new post page
	//or
	//permanentRedirect(`/profile/${username}`)
}

/* useRouter hook
   programmatically change routes from Client Components

   For Server Components, you would redirect() instead.

*/

import { useRouter } from "next/navigation";

export function Page1() {
	const router = useRouter();

	return (
		<button type="button" onClick={() => router.push("/dashboard")}>
			Dashboard
		</button>
		/* 
            router.push(href: string, { scroll: boolean })
            router.replace(href: string, { scroll: boolean }): without adding a new entry into the browser’s history stack
            router.refresh() refresh route re-fetching data requests, and re-rendering Server Components - without losing unaffected client-side React (e.g. useState) or browser state (e.g. scroll position)
            router.prefetch(href: string) default in Link component prefetch the route
            router.back():
            router.forward()
        */
	);
}
//Router events - You can listen for page changes
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
//import { usePathname } from "next/navigation";
//this can be imported to a layout
export function NavigationEvents() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url = `${pathname}?${searchParams}`;
		console.log(url);
		// You can now use the current URL
		// ...
	}, [pathname, searchParams]);

	return null;
}

/* redirects in next.config.js

	redirects may have a limit on platforms. For example, on Vercel, there's a limit of 1,024 redirects. To manage a large number of redirects (1000+), consider creating a custom solution using Middleware.
	redirects runs before Middleware.

*/
module.exports = {
	async redirects() {
		return [
			// Basic redirect
			{
				source: "/about",
				destination: "/",
				permanent: true,
			},
			// Wildcard path matching
			{
				source: "/blog/:slug",
				destination: "/news/:slug",
				permanent: true,
			},
		];
	},
};

/* NextResponse.redirect in Middleware
  Middleware allows you to run code before a request is completed
 
  */
import { NextResponse, NextRequest } from "next/server";
//import { authenticate } from 'auth-provider'

export function middleware(request: NextRequest) {
	//const isAuthenticated = authenticate(request)

	// If the user is authenticated, continue as normal
	/* if (isAuthenticated) {
	  return NextResponse.next()
	} */

	// Redirect to login page if not authenticated
	return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
	matcher: "/dashboard/:path*",
};
