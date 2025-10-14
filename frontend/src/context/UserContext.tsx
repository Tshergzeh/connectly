"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = () => {
            const token = sessionStorage.getItem("token");

            if (token) {
                const profile = JSON.parse(sessionStorage.getItem("user") || "{}");
                setUser({
                    loggedIn: true,
                    isCustomer: profile.is_customer,
                    isProvider: profile.is_provider,
                });
            } else {
                setUser({ loggedIn: false });
            }
        };

        loadUser();

        window.addEventListener("auth-change", loadUser);
        return () => window.removeEventListener("auth-change", loadUser);
    }, []);

    return <UserContext.Provider value={{ user, setUser}}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
