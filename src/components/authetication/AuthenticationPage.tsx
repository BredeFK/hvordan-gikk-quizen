import {Text} from "@radix-ui/themes";
import React from "react";
import {fetchUser} from "../../data/authentification";
import {User} from "../../data/types";
import {Centered} from "../ui/Centered";
import {Navigate} from "react-router-dom";

export default function AuthenticationPage() {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchUser()
            .then(setUser)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Text>Loading…</Text>;

    if (!user?.authenticated) {
        return (
            <Centered>
                <Text size='5' weight='bold' color='red'>Not authenticated</Text>
            </Centered>
        )
    }

    return <Navigate to="/admin" replace/>;
}
