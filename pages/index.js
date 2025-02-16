import { parseCookies } from "nookies";

export async function getServerSideProps(context) {
	const cookies = parseCookies(context);
	if (cookies.auth_token) {
		// User is logged in, redirect to dashboard or other page
		return {
			redirect: {
				destination: "/admin/dashboard",
				permanent: false,
			},
		};
	}

	// User is not logged in, redirect to sign-in page
	return {
		redirect: {
			destination: "/auth/create",
			permanent: false,
		},
	};
}

export default function Home() {
	return null; // This page will never render
}
