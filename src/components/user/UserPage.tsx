import React from "react";
import {Box, Card, Flex, Text, Avatar, Button} from "@radix-ui/themes";
import {Centered} from "../ui/Centered";
import {logout} from "../../data/authentification";
import {fallback, useUser} from "../../data/userContext";
import './UserPage.css'

export default function UserPage() {
    const {user} = useUser();
    const [error, setError] = React.useState<string | null>(null);

    if (!user) {
        return null;
    }

    const displayName = [user.givenName, user.familyName].filter(Boolean).join(" ") || user.email || "Iterate bruker";

    const handleLogout = async () => {
        setError(null);
        try {
            await logout();
        } catch {
            setError("Kunne ikke logge ut");
        }
    };

    return (
        <Centered>
            <Box p='4'>
                <Card size='3' variant='surface'>
                    <Flex direction='column' align='center' gap='4'>
                        <Avatar src={user.picture} fallback={fallback(user.email)} size='7' radius='medium'/>
                        <Text size='6' weight='bold'>{displayName}</Text>
                        {user.email && <Text color='gray'>{user.email}</Text>}
                        {error && <Text color='red'>{error}</Text>}
                        <Button className='logout-button' onClick={handleLogout} color='red'>Logg ut</Button>
                    </Flex>
                </Card>
            </Box>
        </Centered>
    );
}

