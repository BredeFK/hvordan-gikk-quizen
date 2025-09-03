import {Text} from "@radix-ui/themes";
import React from "react";
import {Navigate} from "react-router-dom";
import {useUser} from "../../data/userContext";
import ShowError from "../ui/ShowError";

export default function AuthenticationPage() {
    const {user, loading, error} = useUser();

    if (loading) {
        return <Text>Loading…</Text>;
    }

    if (error) {
        return <ShowError errorMessage='Could not contact server'/>
    }

    if (!user?.authenticated) {
        return <ShowError errorMessage='Not authenticated'/>
    }

    return <Navigate to="/admin" replace/>
}
