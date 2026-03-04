import {Box, Flex} from "@radix-ui/themes";
import type {PropsWithChildren} from "react";

export function Centered({children}: Readonly<PropsWithChildren>) {
    return (
        <Box className='centered' style={{
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Flex direction='column'>
                {children}
            </Flex>
        </Box>
    );
}
