import React from 'react';
import {Box, Button, Card, Flex, Text, TextField} from '@radix-ui/themes';
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {nb as norway} from 'date-fns/locale';
import {Centered} from '../ui/Centered';
import {BadgeDateInput} from '../result-card/ResultCard';
import {RawResult} from '../../data/types';
import {toIso} from "../../data/utils";
import './AdminPage.css';
import {fetchResult, saveResult} from "../../data/backend";

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
        fetchResult(isoDate)
            .then((result: RawResult | null) => {
                setError(null)
                if (result) {
                    setScore(String(result.score));
                    setTotal(String(result.total));
                } else {
                    setScore('');
                    setTotal('10');
                }
            })
            .catch(() => {
                setError('Kunne ikke hente resultat')
                setScore('')
                setTotal('10')
            });
    }, [selectedDate]);

    const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
    const isFuture = selectedDate > today;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            await saveResult({
                date: toIso(selectedDate),
                score: Number(score),
                total: Number(total),
            } as RawResult).then(() => {
                setMessage('Lagret resultat');
                window.dispatchEvent(new Event('results:changed'))
            })
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
