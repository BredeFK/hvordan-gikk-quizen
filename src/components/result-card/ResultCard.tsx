import {Badge, Box, Card, Flex, Heading, Progress, Separator, Text} from '@radix-ui/themes';
import * as Tooltip from '@radix-ui/react-tooltip';
import {ArrowLeftIcon, ArrowRightIcon} from '@radix-ui/react-icons';
import React, {MouseEventHandler, useEffect} from 'react';
import {Result} from '../../data/types';
import 'react-datepicker/dist/react-datepicker.css'
import {useNavigate} from 'react-router-dom';
import './ResultCard.css';
import {Centered} from "../ui/Centered";
import {toIso} from "../../data/utils";
import DatePickerBadge, {injectHeatmapCss} from "../ui/DatePickerBadge";

export default function ResultCard({selectedResult, selectedDateString, availableResults, title, subTitle}: Readonly<{
    selectedResult: Result | null,
    selectedDateString: string,
    availableResults: Result[],
    title: string,
    subTitle: string
}>) {

    const navigate = useNavigate();

    useEffect(() => {
        injectHeatmapCss()
    }, [])

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.repeat) return;
            if (event.key === 'ArrowLeft') {
                previousDay();
            } else if (event.key === 'ArrowRight') {
                nextDay();
            }
        };
        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, [selectedDateString]);

    const selectedDate = React.useMemo(() => new Date(selectedDateString), [selectedDateString]);

    function nextDay() {
        if (selectedDate) {
            const nextDay = new Date(selectedDate)
            nextDay.setDate(selectedDate.getDate() + 1)
            while (nextDay.getDay() === 6 || nextDay.getDay() === 0) {
                nextDay.setDate(nextDay.getDate() + 1)
            }
            navigate(`/${toIso(nextDay)}`)
        }
    }

    function previousDay() {
        if (selectedDate) {
            const previousDay = new Date(selectedDate)
            previousDay.setDate(selectedDate.getDate() - 1)
            while (previousDay.getDay() === 6 || previousDay.getDay() === 0) {
                previousDay.setDate(previousDay.getDate() - 1)
            }
            navigate(`/${toIso(previousDay)}`)
        }
    }

    return (
        <Centered>
            <Box p='4' className='result-box'>
                <Card size='3' variant='surface'>
                    <Flex direction='column' gap='4'>
                        <Flex align='center' justify='between'>
                            <Flex direction='column' gap='0'>
                                <Heading size='6' style={{fontFamily: 'Times New Roman'}}>
                                    {title}
                                </Heading>
                                <Text size='2' color='gray'>{subTitle}</Text>

                            </Flex>
                        </Flex>

                        {selectedResult !== null &&
                            <ScoreModule result={selectedResult}/>
                        }

                        <Separator size='4'/>
                        <Flex direction='column' align='center'>
                            <Flex style={{flexShrink: 0}} direction='column' align='center' gap='2'>

                                <Tooltip.Provider delayDuration={300}>
                                    <Flex direction='row' gap='2' align='center'>
                                        <ArrowButton isLeft={true} onClickEvent={previousDay}/>
                                        <DatePickerBadge selectedDate={selectedDate} results={availableResults} isAdmin={false}
                                                         onChangeDate={(date) => navigate(`/${date}`)}/>
                                        <ArrowButton isLeft={false} onClickEvent={nextDay}/>
                                    </Flex>
                                </Tooltip.Provider>

                                <Badge className='badge-button' asChild color='gray' variant='soft' size='3'>
                                    <button type='button' onClick={() => navigate('/statistikk')}
                                            style={{cursor: 'pointer'}}>Statistikk
                                    </button>
                                </Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                </Card>
            </Box>
        </Centered>
    );
}

function ScoreModule({result}: Readonly<{ result: Result }>) {
    return (
        <>
            <Separator size='4'/>
            <Flex align='end' gap='3'>
                <Text as='div' size='9' weight='bold' style={{lineHeight: 1}}>
                    {result.score}
                </Text>
                <Text size='4' color='gray'>/ {result.total}</Text>
            </Flex>

            <Box>
                <Progress value={result.percentage} style={{
                    height: 12,
                    borderRadius: 999,
                    '--progress-indicator-color': result.colour,
                } as React.CSSProperties}/>
                <Text size='2' color='gray' mt='2' as='div'>
                    {result.percentage}% riktige svar
                </Text>
            </Box>
        </>
    )
}

function ArrowButton({isLeft, onClickEvent}: Readonly<{ isLeft: boolean, onClickEvent: MouseEventHandler }>) {
    const hint = isLeft ? 'Du kan også bruke ← tasten' : 'Du kan også bruke → tasten';

    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <Badge className='badge-button' style={{cursor: 'pointer'}} asChild color='gray' variant='soft'
                       size='3'>
                    <button type='button' onClick={onClickEvent}>
                        {isLeft ? (<ArrowLeftIcon/>) : (<ArrowRightIcon/>)}
                    </button>
                </Badge>
            </Tooltip.Trigger>

            <Tooltip.Portal>
                <Tooltip.Content side='top' align='center' sideOffset={6} className='tooltip-content'>
                    {hint}
                    <Tooltip.Arrow width={8} height={4} className='tooltip-arrow'/>
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    )
}
