"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            if (!res.ok) {
                toast.error("Logout failed");
                return;
            }

            const data = await res.json().catch(() => ({}));
            toast.success("Logged out successfully");

            if (data.logoutUrl) {
                window.location.href = data.logoutUrl;
            } else {
                router.replace("/login");
                router.refresh();
            }

        } catch (error) {
            console.error("Logout error:", error);

            toast.error(
                "Something went wrong while logging out"
            );
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="ml-auto shrink-0 text-oatmeal/70 hover:text-burning-flame transition-colors duration-300 ease-in-out group-data-[collapsible=icon]:hidden"
            aria-label="Log out"
        >
            <LogOut className="h-4 w-4" />
        </button>
    );
}