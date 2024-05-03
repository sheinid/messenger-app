"use client";

import { Toaster } from "react-hot-toast";

interface ProvidersProps {
	children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
	return (
		<>
			<Toaster position="top-right" reverseOrder={false} />
			{children}
		</>
	);
}

export default Providers;
