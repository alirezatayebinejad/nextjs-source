// @ts-nocheck

//asynchronous functions that are executed on the server. They can be used in Server and Client Components
// Server Component
export default function Page() {
	// Server Action
	async function create() {
		"use server";

		// ...
	}

	return null;
}

//in server component and client component

//in app/actions.js/tsx
("use server");

export async function create() {
	// ...
}
//app/ui/button.tsx
//import { create } from '@/app/actions'
export function Button() {
	return null;
}

//You can also pass a Server Action to a Client Component as a prop:
//<ClientComponent updateItem={updateItem} />
/* 'use client'
 
export function ClientComponent({ updateItem }) {
  return <form action={updateItem}></form>
} */

//forms
export function Page1() {
	async function createInvoice(formData: FormData) {
		"use server";

		const rawFormData = {
			customerId: formData.get("customerId"),
			amount: formData.get("amount"),
			status: formData.get("status"),
		};

		// mutate data
		// revalidate cache
	}

	return <form action={createInvoice}>...</form>;
}

//app/client-component.tsx
("use client");
//import { updateUser } from './actions'
export function UserProfile({ userId }: { userId: string }) {
	const updateUserWithId = updateUser.bind(null, userId);

	return (
		<form action={updateUserWithId}>
			<input type="text" name="name" />
			<button type="submit">Update User Name</button>
			<button formAction={updateUserWithId}>another use of actions</button>
		</form>
	);
}
//The Server Action will receive the userId argument, in addition to the form data:
//app/actions.js
("use server");
export async function updateUser(userId: any, formData: any) {
	console.log(userId, formData);
}

// Pending states
//useFormStatus returns the status for a specific <form>, so it must be defined as a child of the <form> element.
("use client");

import { useFormStatus } from "react-dom";

export function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button type="submit" aria-disabled={pending}>
			Add
		</button>
	);
}

//use zod for validation
("use server");
import { z } from "zod";
const schema = z.object({
	email: z.string({
		invalid_type_error: "Invalid Email",
	}),
});
export default async function createUser(formData: FormData) {
	const validatedFields = schema.safeParse({
		email: formData.get("email"),
	});
	// Return early if the form data is invalid
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}
	// Mutate data
	return {
		message: "Please enter a valid email",
	};
}

//useFormState
("use client");
import { useFormState } from "react-dom";
import { createUser } from "@/app/actions";
const initialState = {
	message: "",
};
export function Signup() {
	const [state, formAction] = useFormState(createUser, initialState);

	return (
		<form action={formAction}>
			<label htmlFor="email">Email</label>
			<input type="text" id="email" name="email" required />
			{/* ... */}
			<p aria-live="polite" className="sr-only">
				{state?.message}
			</p>
			<button>Sign up</button>
		</form>
	);
}

//Optimistic hook
/* 
You can use the React useOptimistic hook to optimistically
update the UI before the Server Action finishes, rather than waiting for the response: 
*/
("use client");
import { useOptimistic } from "react";
import { send } from "./actions";

type Message = {
	message: string;
};
export function Thread({ messages }: { messages: Message[] }) {
	const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[]>(messages, (state: Message[], newMessage: string) => [...state, { message: newMessage }]);
	return (
		<div>
			{optimisticMessages.map((m, k) => (
				<div key={k}>{m.message}</div>
			))}
			<form
				action={async (formData: FormData) => {
					const message = formData.get("message");
					addOptimisticMessage(message);
					await send(message);
				}}
			>
				<input type="text" name="message" />
				<button type="submit">Send</button>
			</form>
		</div>
	);
}
