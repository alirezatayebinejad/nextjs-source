//in folders we have files that does their uniqe jobs. some special files:
/* 
layout=                Shared UI for a segment and its children
page=	               Unique UI of a route and make routes publicly accessible
template=	           Specialized re-rendered Layout UI
loading=	           Loading UI for a segment and its children
not-found=	           Not found UI for a segment and its children
error=	               Error UI for a segment and its children
global-error=	       Global Error UI
route=	               Server-side API endpoint
default=               Fallback UI for Parallel Routes
*/

/*  page.js:

    export a component from it to create the ui of a page/route
    Pages are Server Components by default but can be set to a Client Component.
    Pages can fetch data
 */
//inside app/page.js/jsx/ts/tsx or the app/dashboard/setting
export function Page() {
	return <h1>Hello, Home page!</h1>;
}

/* layout.js

    You can define a layout by default exporting a React component from a layout.js file.
    The component should accept a children prop that will be
    populated with a child layout (if it exists) or a child page during rendering.
    Layouts are Server Components by default but can be set to a Client Component.
    Layouts can fetch data.
    Passing data between a parent layout and its children is not possible.
    Layouts do not have access to the route segments below itself.
    Layouts are nested in nextjs folder hierarchy
*/
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<section>
			<nav></nav>
			{children}
		</section>
	);
}

/* Templates 

    Templates are similar to layouts in that they wrap each child layout or page.
    Unlike layouts that persist across routes and maintain state, templates create
    a new instance for each of their children on navigation. 
    In terms of nesting, template.js is rendered between a layout and its children.
    the layout persist the states and effects but the layouts re runs with changing the routes

*/
export function Template({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}

/* Loading.js
    showing the loading ui befor everything ready in the page
*/
export function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return <div>Skeleten ui</div>;
}
//using Suspense
//this way every part if ready is rendered
//rap the unimportant time consuming (fetching) component of the page with suspense
import { Suspense } from "react";
//import { PostFeed, Weather } from './Components'
export function Posts() {
	return (
		<section>
			<Suspense fallback={<p>Loading feed...</p>}>{/*  <PostFeed /> */}</Suspense>
			<Suspense fallback={<p>Loading weather...</p>}>{/* <Weather /> */}</Suspense>
		</section>
	);
}

/* Error handling

    An error.js boundary will not handle errors thrown in a layout.js component in the same segment because the error boundary is nested inside that layout's component.
    To handle errors within the root layout or template, use a variation of error.js called global-error.js in app/
*/

("use client"); // Error components must be Client Components
import { useEffect } from "react";

export function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div>
			<h2>Something went wrong!</h2>
			<button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Try again
			</button>
		</div>
	);
}
