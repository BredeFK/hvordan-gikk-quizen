import React from "react";
import {Box, Flex} from "@radix-ui/themes";

export function Centered({children}: Readonly<React.PropsWithChildren<{}>>) {
    return (
        <Box className='centered' style={{
            minHeight: '100vh',
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
