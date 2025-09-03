import React from 'react';
import {Box, Button, Card, Flex, Text, TextField} from '@radix-ui/themes';
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {nb as norway} from 'date-fns/locale';
import {Centered} from '../ui/Centered';
import {BadgeDateInput} from '../result-card/ResultCard';
import {Result} from '../../data/types';
import {percentageFromScore, toIso} from "../../data/utils";
import {colorFromScore} from "../../theme/colours";
import './AdminPage.css';

registerLocale('nb', norway);

export default function AdminPage() {
    const today = React.useMemo(() => new Date(), []);
    const [selectedDate, setSelectedDate] = React.useState<Date>(today);
    const [score, setScore] = React.useState<string>('');
    const [total, setTotal] = React.useState<string>('10');
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const isoDate = toIso(selectedDate);
        fetchResult(isoDate, false)
            .then((r: Result | null) => {
                if (r) {
                    setScore(String(r.score));
                    setTotal(String(r.total));
                } else {
                    setScore('');
                    setTotal('10');
                }
            })
            .catch(() => setError('Kunne ikke hente resultat'));
    }, [selectedDate]);

    const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
    const isFuture = selectedDate > today;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            const numberScore = Number(score);
            const numberTotal = Number(total);
            await saveResult({
                date: selectedDate,
                score: numberScore,
                total: numberTotal,
                dateString: toIso(selectedDate),
                colour: colorFromScore(numberScore),
                percentage: percentageFromScore(numberScore, numberTotal)
            });
            setMessage('Lagret resultat');
        } catch {
            setError('Kunne ikke lagre resultat');
        }
    };

    const disabled = isWeekend(selectedDate) || isFuture || score === '' || total === '';

    return (
        <Centered>
            <Box p='4' className='admin-box'>
                <Card
                    size='3'
                    variant='surface'
                >
                    <form onSubmit={handleSubmit}>
                        <Flex direction='column' gap='3'>
                            <Flex direction='column' gap='1'>
                                <Text size='2'>Dato</Text>
                                <DatePicker
                                    portalId='dp-portal'
                                    locale='nb'
                                    dateFormat='d. MMMM yyyy'
                                    selected={selectedDate}
                                    maxDate={today}
                                    onChange={(date) => {
                                        if (date) {
                                            setSelectedDate(date)
                                        }
                                    }}
                                    filterDate={(d) => !isWeekend(d)}
                                    customInput={<BadgeDateInput/>}
                                />
                            </Flex>
                            <Flex direction='column' gap='1'>
                                <Text size='2'>Poeng</Text>
                                <TextField.Root
                                    autoFocus
                                    type='number'
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    min='0'
                                />
                            </Flex>
                            <Flex direction='column' gap='1'>
                                <Text size='2'>Total</Text>
                                <TextField.Root
                                    type='number'
                                    value={total}
                                    onChange={(e) => setTotal(e.target.value)}
                                    min='0'
                                    max='10'
                                    disabled
                                />
                            </Flex>

                            {/* Message area with reserved space */}
                            <Flex direction='column' gap='1' style={{minHeight: '24px'}}>
                                {error && <Text color='red'>{error}</Text>}
                                {message && <Text color='green'>{message}</Text>}
                                {!error && !message && (
                                    <Text style={{visibility: 'hidden'}}>placeholder</Text>
                                )}
                            </Flex>

                            {isWeekend(selectedDate) && (
                                <Text color='red'>Kan ikke legge inn resultat i helgen</Text>
                            )}
                            {isFuture && (
                                <Text color='red'>Kan ikke legge inn resultat i fremtiden</Text>
                            )}
                            <Button type='submit' disabled={disabled}>Lagre</Button>
                        </Flex>
                    </form>
                </Card>
            </Box>
        </Centered>
    );
}

function fetchResult(isoDate: string, getResult: boolean): Promise<Result | null> {
    if (!getResult) {
        return Promise.resolve(null);
    }
    const date = new Date(isoDate);
    const score = Math.floor(Math.random() * (10 + 1));
    return Promise.resolve({
        date: date,
        score: score,
        total: 10,
        dateString: isoDate,
        colour: colorFromScore(score),
        percentage: percentageFromScore(score, 10)
    }) // TODO : Implement this
}

function saveResult(result: Result): Promise<null> {
    console.log('Saving result', result);
    return Promise.resolve(null); // TODO : Implement this
}
