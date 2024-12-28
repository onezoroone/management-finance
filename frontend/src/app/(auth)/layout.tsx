"use client"

import useAuthStore from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const {isAuthenticated} = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);
    return (
        <>
        {children}
        </>
    );
}
