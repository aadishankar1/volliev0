"use client";
import { useRouter } from 'next/navigation'
import {  useEffect } from "react";
export default function AuthWrapper({ user,children }: { user: boolean,children: React.ReactNode }) {
    const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/"); // Redirect to homepage if authenticated
    }
  }, [user, router]);

  return children;
}