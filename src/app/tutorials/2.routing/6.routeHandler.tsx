//allow you to create custom request handlers for a given route using the Web Request and Response APIs.
/*
can be nested inside the app directory, similar to page.js and layout.js. 
But there cannot be a route.js file at the same route segment level as page.js.
GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS

*/

//Route Handlers are cached by default when using the GET method with the Response object.
export async function GET() {
	const res = await fetch("https://data.mongodb-api.com/...", {
		headers: {
			"Content-Type": "application/json",
			"API-Key": process.env.DATA_API_KEY || "",
		},
	});
	const data = await res.json();

	return Response.json({ data });
}
/* opt out of the catching:
Using the Request object with the GET method.
Using any of the other HTTP methods.
Using Dynamic Functions like cookies and headers.
The Segment Config Options manually specifies dynamic mode.

*/
export async function POST() {
	const res = await fetch("https://data.mongodb-api.com/...", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"API-Key": process.env.DATA_API_KEY!,
		},
		body: JSON.stringify({ time: new Date().toISOString() }),
	});

	const data = await res.json();

	return Response.json(data);
}

//Revalidating Cached Data
export async function GET1() {
	const res = await fetch("https://data.mongodb-api.com/...", {
		next: { revalidate: 60 }, // Revalidate every 60 seconds
	});
	const data = await res.json();

	return Response.json(data);
}
//or
export const revalidate = 60;

//cookies
import { cookies } from "next/headers";

export async function GET2(request: Request) {
	const cookieStore = cookies();
	const token = cookieStore.get("token") || { value: "" };

	return new Response("Hello, Next.js!", {
		status: 200,
		headers: { "Set-Cookie": `token=${token.value}` },
	});
}
//read cookies
import { type NextRequest } from "next/server";

export async function GET3(request: NextRequest) {
	const token = request.cookies.get("token");
}

//headers
import { headers } from "next/headers";

export async function GET4(request: Request) {
	const headersList = headers();
	const referer = headersList.get("referer");

	const responseHeaders = new Headers();
	if (referer) {
		responseHeaders.set("referer", referer);
	}

	return new Response("Hello, Next.js!", {
		status: 200,
		headers: responseHeaders,
	});
}

//Redirects
import { redirect } from "next/navigation";

export async function GET5(request: Request) {
	redirect("https://nextjs.org/");
}

//dynamic segments
// in app/items/[slug]/route.ts
export async function GET6(request: Request, { params }: { params: { slug: string } }) {
	const slug = params.slug; // 'a', 'b', or 'c'
}

//URL Query Parameters
export function GET7(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("query");
	// query is "hello" for /api/search?query=hello
}

//Streaming
//Streaming is commonly used in combination with Large Language Models (LLMs), such as OpenAI, for AI-generated content.
//read more: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming

//Request Body
export async function POST1(request: Request) {
	const res = await request.json();
	return Response.json({ res });
}
//Request Body FormData
export async function POST2(request: Request) {
	const formData = await request.formData();
	const name = formData.get("name");
	const email = formData.get("email");
	return Response.json({ name, email });
}

//set CORS
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET8(request: Request) {
	return new Response("Hello, Next.js!", {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}

//Webhooks
//You can use a Route Handler to receive webhooks from third-party services:
export async function POST3(request: Request) {
	try {
		const text = await request.text();
		// Process the webhook payload
	} catch (error: any) {
		return new Response(`Webhook error: ${error.message}`, {
			status: 400,
		});
	}

	return new Response("Success!", {
		status: 200,
	});
}

//to specify the runtime:
export const runtime = "edge"; // 'nodejs' is the default

//Non-UI Responses
//You can use Route Handlers to return non-UI content. Note that sitemap.xml, robots.txt, app icons, and open graph images all have built-in support.

//export const dynamic = 'force-dynamic' // defaults to auto

export async function GET9() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
 
<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>
 
</rss>`,
		{
			headers: {
				"Content-Type": "text/xml",
			},
		}
	);
}

//Segment Config Options
//https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
/*
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
*/
