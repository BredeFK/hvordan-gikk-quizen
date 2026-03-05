import {fetchUser, ONLY_FRONTEND} from "./backend";
import {type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {UserContext} from "./userContextDef";
import type {User} from "./types.ts";

export function UserProvider({children}: Readonly<{ children: ReactNode }>) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async () => {
        if (!ONLY_FRONTEND) {
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
        } else {
            setError(null);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const value = useMemo(() => (
        {user, loading, error, refetch: load}), [user, loading, error, load]
    );
    return (
        <UserContext value={value}>
            {children}
        </UserContext>
    );
}

