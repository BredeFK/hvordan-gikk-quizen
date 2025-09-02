import React from "react";
import {User} from "./types";
import {fetchUser} from "./authentification";

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: Readonly<{ children: React.ReactNode }>) {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const u = await fetchUser();
            setUser(u);
        } catch (e) {
            setError(e as Error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void load();
    }, [load]);

    const value = React.useMemo(() => (
        {user, loading, error, refetch: load}), [user, loading, error, load]
    );
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserContextType {
    const ctx = React.useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within UserProvider");
    }
    return ctx;
}

