import {Badge, Box, Card, Flex, Heading, Progress, Separator, Text, Theme} from "@radix-ui/themes";
import React from "react";
import {Result} from "../../data/types";

export default function QuizResult({result}: Readonly<{ result: Result }>) {

    const progress = Math.max(0, Math.min(100, Math.round((result.score / result.total) * 100)));
    const accent = accentForPct(progress);

    return (
        <Box p='4' className='result-box'>
            <Card size='3' variant='surface'>
                <Flex direction='column' gap='4'>
                    <Flex align='center' justify='between'>
                        <Heading size='5'>Quiz Resultat</Heading>
                        <Badge color='gray' variant='soft' size='3'>{formatDatePretty(result.date)}</Badge>
                    </Flex>

                    <Separator size='4'/>

                    <Flex align='end' gap='3'>
                        <Text as='div' size='9' weight='bold' style={{lineHeight: 1}}>
                            {result.score}
                        </Text>
                        <Text size='4' color='gray'>/ {result.total}</Text>
                    </Flex>

                    <Box>
                        <Theme accentColor={accent}>
                            <Progress value={progress} style={{height: 12, borderRadius: 999}}/>
                        </Theme>
                        <Text size='2' color='gray' mt='2' as='div'>
                            {progress}% riktige svar
                        </Text>
                    </Box>
                </Flex>
            </Card>
        </Box>
    );
}

function formatDatePretty(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function accentForPct(percentage: number): React.ComponentProps<typeof Theme>['accentColor'] {
    if (percentage === 100) return 'green';
    if (percentage >= 70) return 'blue';
    if (percentage >= 60) return 'amber';
    if (percentage >= 50) return 'red';
    return 'red';
}
