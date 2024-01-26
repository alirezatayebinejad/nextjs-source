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
