import {Centered} from "../ui/Centered";
import {Avatar, Box, Button, Card, Flex, Text} from "@radix-ui/themes";
import {useUser} from "../../data/userContext";
import ShowError from "../ui/ShowError";
import React from "react";
import {logout} from "../../data/backend";
import {fallback} from "../../data/utils";

export default function UserPage() {
    const [error, setError] = React.useState<string | null>(null);
    const {user} = useUser();

    if (!user) {
        return <ShowError errorMessage='Fant ikke bruker'/>
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
                    <Flex direction='column' align='center' mt='4' mx='4' mb='2'>
                        <Avatar src={user.picture} fallback={fallback(user.email)} size='7' radius='medium' mb='5'/>
                        <Text size='6' weight='bold'>{displayName}</Text>
                        {user.email && <Text color='gray'>{user.email}</Text>}
                        {error && <Text color='red'>{error}</Text>}
                        <Button className='logout-button' onClick={handleLogout} color='red' mt='5' size='3'>Logg
                            ut</Button>
                    </Flex>
                </Card>
            </Box>
        </Centered>
    );
}
