import {Text} from "@radix-ui/themes";
import React from "react";
import {Centered} from "../ui/Centered";
import {Navigate} from "react-router-dom";
import {useUser} from "../../data/userContext";

export default function AuthenticationPage() {
    const {user, loading, error} = useUser();

    if (loading) {
        return <Text>Loading…</Text>;
    }

    if (error) {
        return (
            <Centered>
                <Text size='5' weight='bold' color='red'>Could not contact server</Text>
            </Centered>
        );
    }

    if (!user?.authenticated) {
        return (
            <Centered>
                <Text size='5' weight='bold' color='red'>Not authenticated</Text>
            </Centered>
        );
    }

    return <Navigate to="/bruker" replace/>;
}
