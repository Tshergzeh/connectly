"use client";

import AuthForm from "~/components/auth/AuthForm";
import { loginUser } from "~/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async ({ email, password }: any) => {
        const { accessToken } = await loginUser(email, password);
        localStorage.setItem("token", accessToken);
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-grey-50">
            <AuthForm type="login" onSubmit={handleLogin} />
        </div>
    );
}