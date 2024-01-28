//When you don't know the exact segment names ahead of time and want to create routes from dynamic data
//app/blog/[slug]/page.tsx
export default function Page({ params }: { params: { slug: string } }) {
	return <div>My Post: {params.slug}</div>;
}
// matches /blog/a /blog/b /blog/c or whatever we have available

/* Generating Static Params
to statically generate routes at build time instead of on-demand at request time.
generating the dynamic pages at build time so it reduces the fetching of dynamic data by making it static
*/
export async function generateStaticParams() {
	const posts = await fetch("https://.../posts").then((res) => res.json());

	return posts.map((posts: any) => ({
		slug: posts.slug,
	}));
}

/* Catch-all Segments

app/shop/[...slug]/page.js

will match /shop/clothes/tops /shop/clothes/tops/t-shirts
/shop/a/b/c    { slug: ['a', 'b', 'c'] }

*/

/* Optional Catch-all Segments

app/shop/[[...slug]]/page.js

will match /shop  /shop/clothes  /shop/clothes/tops /shop/clothes/tops/t-shirts.
/shop	    {}
/shop/a/b	{ slug: ['a', 'b'] }
*/
