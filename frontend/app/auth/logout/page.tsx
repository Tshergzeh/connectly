"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-100">
      Logging out...
    </div>
  );
}
