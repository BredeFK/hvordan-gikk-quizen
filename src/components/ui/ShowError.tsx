import {Centered} from "./Centered";
import {Card, Text} from "@radix-ui/themes";


export default function ShowError({errorMessage, error = null}: Readonly<{
    errorMessage: string,
    error?: string | null,
}>) {
    return (
        <Centered>
            <Card size='4' variant='surface'>
                <Text size='5' color='red'>{
                    error?.startsWith('Network error')
                        ? 'API\'et er nede – prøv igjen om litt'
                        : errorMessage
                }</Text>
            </Card>
        </Centered>
    )
}
