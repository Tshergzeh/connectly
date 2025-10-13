"use client";

import AuthForm from "~/components/auth/AuthForm";
import { loginUser } from "~/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async ({ email, password }: any) => {
        try {
            const { accessToken, user } = await loginUser(email, password);
            sessionStorage.setItem("token", accessToken);
            sessionStorage.setItem("user", JSON.stringify(user));
            router.push("/");
        } catch (error: any) {
            console.error("Login failed", error.message);
            throw error;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-grey-50">
            <AuthForm type="login" onSubmit={handleLogin} />
        </div>
    );
}