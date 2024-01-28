//Parallel Routes
/*
simultaneously or conditionally render one or more pages within the same layout
Parallel routes are created using named slots. Slots are defined with the @folder convention.

like:
app/@team/
app/@analytics/
slots are passed as props to the shared parent layout
slots are not route segments and do not affect the URL structure
if the page hard reload happens then the slot that does not match url will be 404 or default.js if exist
*/
export default function Layout({ children, team, analytics }: { children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode }) {
	return (
		<>
			{children}
			{team}
			{analytics}
		</>
	);
}

/* 
  default.js
You can define a default.js file to render as a fallback for unmatched slots 
during the initial load or full-page reload.
 */

/* useSelectedLayoutSegment(s)
Both useSelectedLayoutSegment and useSelectedLayoutSegments accept a parallelRoutesKey parameter, which allows you to read the active route segment within a slot.


*/
("use client");

import { useSelectedLayoutSegment } from "next/navigation";

export function Layout1({ auth }: { auth: React.ReactNode }) {
	const loginSegments = useSelectedLayoutSegment("auth"); // login route be 'login'
	// ...
}

//Conditional Routes

export function Layout2({ user, admin }: { user: React.ReactNode; admin: React.ReactNode }) {
	const role = "admin";
	return <>{role === "admin" ? admin : user}</>;
}

/* Intercepting Routes
allows you to load a route from another part of your application within the current layout
and keeping the current context
when clicking on a photo in a feed, you can display the photo in a modal,
overlaying the feed. In this case, Next.js intercepts the /photo/123 route, masks the URL, and overlays it over /feed.
when navigating to the photo by clicking a shareable URL or by refreshing the page, the entire photo page should render instead of the modal.
(.) to match segments on the same level
(..) to match segments one level above
(..)(..) to match segments two levels above
(...) to match segments from the root app directory


example:
feed/@modal/(..)photo/[id]/page.js  here create a modal and (..) points to the bellow address
photo/[id]/page.js
example in doc:
https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals
https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#examples

 */
