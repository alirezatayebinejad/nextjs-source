//for ways to fetch data:
/* 
On the server, with fetch
On the server, with third-party libraries
On the client, via a Route Handler
On the client, with third-party libraries.

*/

//Fetching Data on the Server with fetch
//You can use fetch with async/await in Server Components, in Route Handlers, and in Server Actions.
//in page.js
async function getData() {
	const res = await fetch("https://api.example.com/...");
	// The return value is *not* serialized
	// You can return Date, Map, Set, etc.

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

export default async function Page() {
	const data = await getData();

	return <main></main>;
}
/* 
In Route handlers, fetch requests are not memoized as Route Handlers are not
 part of the React component tree.

*/

//Caching Data
/* 
Caching stores data so it doesn't need to be re-fetched from your data source on every request.
By default, Next.js automatically caches the returned values of fetch in the Data Cache on the server. 
fetch requests that use the POST method are also automatically cached. Unless it's inside a Route Handler that uses the POST method, then it will not be cached.
*/
fetch("https://...", { cache: "force-cache" }); //default - can be removed

//Revalidating Data
/* Cached data can be revalidated in two ways:
Time-based revalidation
On-demand revalidation
 */

//Time-based revalidation
fetch("https://...", { next: { revalidate: 3600 } });
//or for all requests in segments
export const revalidate = 3600;

//On-demand Revalidation
/* 
Data can be revalidated on-demand by path (revalidatePath)
 or by cache tag (revalidateTag) inside a Server Action or Route Handler.
*/
//in page.js
export async function Page1() {
	const res = await fetch("https://...", { next: { tags: ["collection"] } });
	const data = await res.json();
	// ...
}
//in app/actions.ts
("use server");

import { revalidateTag } from "next/cache";

export async function action() {
	revalidateTag("collection");
}

/* 
fetch requests are not cached if:

The cache: 'no-store' is added to fetch requests.
The revalidate: 0 option is added to individual fetch requests.
The fetch request is inside a Router Handler that uses the POST method.
The fetch request comes after the usage of headers or cookies.
The const dynamic = 'force-dynamic' route segment option is used.
The fetchCache route segment option is configured to skip cache by default.
The fetch request uses Authorization or Cookie headers and there's an uncached request above it in the component tree.
*/

//Fetching data on the Server with third-party libraries
/* 
 library that doesn't support or expose fetch (for example, a database, CMS, or ORM client),
  you can configure the caching and revalidating behavior of those requests
  using the Route Segment Config Option and React's cache function.
 If the segment is static (default), the output of the request will be
  cached and revalidated as part of the route segment. If the segment is dynamic,
  the output of the request will not be cached and will be re-fetched on every request when the segment is rendered.
*/
//in app/utils.ts
import { cache } from "react";

export const getItem = cache(async (id: string) => {
	// const item = await db.item.findUnique({ id })
	//return item
});
//in app/item/[id]/layout.tsx
//import { getItem } from '@/utils/get-item'
//export const revalidate = 3600 // revalidate the data at most every hour
export async function Layout({ params: { id } }: { params: { id: string } }) {
	const item = await getItem(id);
	// ...
}
//app/item/[id]/page.tsx
//import { getItem } from '@/utils/get-item'
//export const revalidate = 3600 // revalidate the data at most every hour
export async function Page2({ params: { id } }: { params: { id: string } }) {
	const item = await getItem(id);
	// ...
}
//Although the getItem function is called twice, only one query will be made to the database.
