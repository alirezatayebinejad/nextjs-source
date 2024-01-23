//routing in next js is based on folders and files
//for domain.com/setting/profile we need two folders like profile folder inside the setting folder
//in folders we have files that does their uniqe jobs. some file conventions:
/* 
layout=                Shared UI for a segment and its children
page=	               Unique UI of a route and make routes publicly accessible
loading=	           Loading UI for a segment and its children
not-found=	           Not found UI for a segment and its children
error=	               Error UI for a segment and its children
global-error=	       Global Error UI
route=	               Server-side API endpoint
template=	           Specialized re-rendered Layout UI
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
*/

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<section>
			<nav></nav>
			{children}
		</section>
	);
}
