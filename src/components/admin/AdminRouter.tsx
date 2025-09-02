import React from "react";
import {Navigate} from "react-router-dom";
import {Text} from "@radix-ui/themes";
import {fetchUser} from "../../data/authentification";
import {User} from "../../data/types";

export default function AdminRouter({children}: Readonly<{ children: React.ReactNode }>) {
    const [me, setMe] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchUser()
            .then(setMe)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Text>Loading…</Text>;
    if (!me?.authenticated) return <Navigate to="/login" replace/>;

    return <>{children}</>;
}
