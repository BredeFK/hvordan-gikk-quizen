import React from "react";
import {Navigate} from "react-router-dom";
import {Text} from "@radix-ui/themes";
import {useUser} from "../../data/userContext";

export default function AdminRouter({children}: Readonly<{ children: React.ReactNode }>) {
    const {user, loading, error} = useUser();

    if (loading) {
        return <Text>Loading…</Text>;
    }
    if (error) {
        return <Text color='red'>Could not contact server</Text>;
    }
    if (!user?.authenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
}
