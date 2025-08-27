import {Badge, Box, Card, Flex, Heading, Progress, Separator, Text} from '@radix-ui/themes';
import {CalendarIcon} from "@radix-ui/react-icons";
import React, {useEffect} from 'react';
import {BadgeInputProps, Result} from '../../data/types';
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import {nb as norway} from 'date-fns/locale';
import {useNavigate} from "react-router-dom";
import './QuizResult.css';
import {heatmapColors} from "../../theme/colours";

registerLocale('nb', norway);

export default function QuizResult({selectedResult, availableResults}: Readonly<{
    selectedResult: Result,
    availableResults: Result[]
}>) {

    useEffect(() => {
        injectHeatmapCss();
    }, [])

    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(() => new Date(selectedResult.dateString));

    const includedDates = React.useMemo(
        () =>
            availableResults
                .map(result => result.date)
                .sort((a, b) => a.getTime() - b.getTime()),
        [availableResults]
    );

    const highlightByColor = React.useMemo(() => {
        const groups: Record<string, Date[]> = {};
        for (const r of availableResults) {
            const cls = `react-datepicker__day--highlighted-${r.score}`;
            if (!groups[cls]) {
                groups[cls] = [];
            }
            groups[cls].push(new Date(r.dateString));
        }
        return Object.entries(groups).map(([k, v]) => ({[k]: v}));
    }, [availableResults]);

    console.log(highlightByColor);

    const minDate = includedDates[0];

    return (
        <Box p='4' className='result-box'>
            <Card size='3' variant='surface'>
                <Flex direction='column' gap='4'>
                    <Flex align='center' justify='between'>
                        <Heading size='5'>Quiz Resultat</Heading>
                        <Flex style={{flexShrink: 0}}>
                            <DatePicker
                                portalId='dp-portal'
                                locale='nb'
                                dateFormat='d. MMMM yyyy'
                                selected={selectedDate}
                                includeDates={includedDates}
                                highlightDates={highlightByColor}
                                minDate={minDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    if (date) {
                                        navigate(`/${toIso(date)}`)
                                    }
                                }}
                                customInput={<BadgeDateInput/>}
                            />
                        </Flex>
                    </Flex>

                    <Separator size='4'/>

                    <Flex align='end' gap='3'>
                        <Text as='div' size='9' weight='bold' style={{lineHeight: 1}}>
                            {selectedResult.score}
                        </Text>
                        <Text size='4' color='gray'>/ {selectedResult.total}</Text>
                    </Flex>

                    <Box>
                        <Progress value={selectedResult.percentage} style={{
                            height: 12,
                            borderRadius: 999,
                            "--progress-indicator-color": selectedResult.colour,
                        } as React.CSSProperties}/>
                        <Text size='2' color='gray' mt='2' as='div'>
                            {selectedResult.percentage}% riktige svar
                        </Text>
                    </Box>
                </Flex>
            </Card>
        </Box>
    );
}

function toIso(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export const BadgeDateInput = ({ref, value, onClick}: BadgeInputProps & {
    ref?: React.RefObject<HTMLButtonElement | null>
}) => (
    <Badge asChild color="gray" variant="soft" size="3">
        <button
            type="button"
            ref={ref}
            onClick={onClick}
            aria-label="Velg dato"
            title='Velg dato'
            style={{cursor: "pointer"}}>
                <span className='calendar-display' style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
                    <CalendarIcon width={16} height={16}/>
                    <span>{value ?? "Velg dato"}</span>
                </span>
        </button>
    </Badge>
);
BadgeDateInput.displayName = "BadgeDateInput";

function injectHeatmapCss() {
    const style = document.createElement('style');
    style.innerHTML = heatmapColors
        .map((c, i) => `
      .react-datepicker__day--highlighted-${i},
      .react-datepicker__day--highlighted-${i}:hover {
        background: ${c};
        border-radius: 0.3rem;
        color: ${(i <= 5 || i >= 9) ? 'white' : 'black'};
      }
    `).join('\n');
    document.head.appendChild(style);
}
