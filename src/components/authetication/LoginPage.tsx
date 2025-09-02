import React from "react";
import {Flex, Text, Card, Box} from "@radix-ui/themes";
import logo from '../../assets/iterate.gif'
import GoogleButton from "../ui/GoogleButton";
import {Centered} from "../ui/Centered";

export default function LoginPage() {
    const imgSize = 120
    return (
        <Centered>
            <Box p='4'>
                <Card size='3' variant='surface'>
                    <Flex direction="column" align="center" gap='4'>
                        <img src={logo} height={imgSize} width={imgSize} alt="Iterate logo"/>
                        <Text size="6" weight="bold">
                            Hvordan gikk quizen?
                        </Text>
                        <Text color="gray" align="center">
                            Du må logge inn med Iterate kontoen din for å få tilgang til admin-siden.
                        </Text>
                        <GoogleButton size='3'/>
                    </Flex>
                </Card>
            </Box>
        </Centered>
    );
}
