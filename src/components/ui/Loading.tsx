import {Centered} from "./Centered";
import {Flex, Spinner, Text} from "@radix-ui/themes/dist/esm";
import React from "react";

export default function Loading({loadingText}: Readonly<{ loadingText: string | null }>) {
    return (
        <Centered>
            <Flex align='center' direction='row' justify='center' gap='2'>
                {loadingText &&
                    <Text size='5'>{loadingText}</Text>
                }
                <Spinner size='3'/>
            </Flex>
        </Centered>
    )
}
