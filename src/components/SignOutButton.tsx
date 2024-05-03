"use client";

import { ButtonHTMLAttributes, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

function SignOutButton({ ...props }: SignOutButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Button
			{...props}
			variant="ghost"
			onClick={async () => {
				setIsLoading(true);
				try {
					await signOut();
				} catch (e) {
					toast.error("There was an error signing out");
				} finally {
					setIsLoading(false);
				}
			}}
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<LogOut className="h-4 w-4" />
			)}
		</Button>
	);
}

export default SignOutButton;
