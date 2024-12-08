export async function getServerSideProps() {
	return {
		redirect: {
			destination: "/auth/signin",
			permanent: false, // Change to true if this redirect is permanent
		},
	};
}

export default function Home() {
	return null; // This page will never render
}
