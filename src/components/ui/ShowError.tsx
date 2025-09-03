import {Centered} from "./Centered";
import {Text} from "@radix-ui/themes/dist/esm";
import React from "react";

export default function ShowError({errorMessage}: Readonly<{ errorMessage: string }>) {
    return (
        <Centered>
            <Text size='5' weight='bold' color='red'>{errorMessage}</Text>
        </Centered>
    )
}
