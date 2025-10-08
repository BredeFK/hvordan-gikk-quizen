import React from 'react';
import {Box, Button, Card, Flex, Text, TextField, Checkbox} from '@radix-ui/themes';
import {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {nb as norway} from 'date-fns/locale';
import {Centered} from '../ui/Centered';
import {RawResult, Result} from '../../data/types';
import {toIso} from "../../data/utils";
import './AdminPage.css';
import {fetchDistinctQuizSources, fetchResult, saveResult} from "../../data/backend";
import DatePickerBadge, {injectHeatmapCss} from "../ui/DatePickerBadge";
import CreatableSelect from 'react-select/creatable';
import {darkThemePalette} from '../../theme/colours';

registerLocale('nb', norway);

export default function AdminPage({results}: Readonly<{ results: Result[] }>) {
    const today = React.useMemo(() => new Date(), []);
    const [selectedDate, setSelectedDate] = React.useState<Date>(today);
    const [score, setScore] = React.useState<string>('');
    const [total, setTotal] = React.useState<string>('10');
    const [quizSource, setQuizSource] = React.useState<string>('');
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [sendSlack, setSendSlack] = React.useState<boolean>(true);
    const [quizSources, setQuizSources] = React.useState<string[]>([]);

    React.useEffect(() => {
        const isoDate = toIso(selectedDate);
        injectHeatmapCss()
        fetchResult(isoDate)
            .then((result: RawResult | null) => {
                setError(null)
                if (result) {
                    setScore(String(result.score));
                    setTotal(String(result.total));
                    setQuizSource(String(result.quizSource));
                } else {
                    setScore('');
                    setTotal('10');
                    setQuizSource('');
                }
            })
            .catch(() => {
                setError('Kunne ikke hente resultat')
                setScore('')
                setTotal('10')
            });
    }, [selectedDate]);

    React.useEffect(() => {
        fetchDistinctQuizSources().then((sources: string[] | null) => {
            if (sources) {
                setQuizSources(sources)
            } else {
                setQuizSources([])
            }
        })
    }, [quizSource])

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
                    quizSource: quizSource
                } as RawResult,
                sendSlack).then(() => {
                setMessage('Lagret resultat');
                window.dispatchEvent(new Event('results:changed'))
            })
        } catch {
            setError('Kunne ikke lagre resultat');
        }
    };

    const disabled = isWeekend(selectedDate) || isFuture || score === '' || total === '' || quizSource === '';

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
                                <DatePickerBadge selectedDate={selectedDate} results={results} isAdmin={true}
                                                 onChangeDate={(date) => setSelectedDate(new Date(date))}/>
                            </Flex>
                            <Flex direction='column' gap='1'>
                                <Text size='2'>Poeng</Text>
                                <TextField.Root
                                    autoFocus
                                    type='number'
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    min='0'
                                    max={total}
                                />
                            </Flex>
                            <Flex direction='column' gap='2'>
                                <Text size='2'>Total</Text>
                                <TextField.Root
                                    type='number'
                                    value={total}
                                    onChange={(e) => setTotal(e.target.value)}
                                    min='0'
                                />
                            </Flex>
                            <Flex direction='column' gap='1'>
                                <Text size='2'>Kilde</Text>
                                <CreatableSelect
                                    isClearable
                                    onChange={(source) => setQuizSource(source?.value || '')}
                                    options={quizSources.map((source) => ({value: source, label: source}))}
                                    value={quizSource ? {value: quizSource, label: quizSource} : null}
                                    theme={(theme) => ({
                                        ...theme,
                                        colors: {
                                            ...theme.colors,
                                            primary: darkThemePalette.palette.primary.main,
                                            primary25: "#0F1312",
                                            neutral0: "#0F1312",
                                            neutral80: "#ECEFED",
                                            neutral20: "#484F4C",
                                            neutral30: "#484F4C",
                                        },
                                    })}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: "32px",
                                            height: "32px",
                                            borderRadius: "6px",
                                        }),
                                        valueContainer: (base) => ({
                                            ...base,
                                            padding: "0 8px",
                                        }),
                                        indicatorsContainer: (base) => ({
                                            ...base,
                                            height: "32px",
                                        }),
                                    }}
                                />
                            </Flex>
                            <Flex align='center' gap='2'>
                                <Checkbox
                                    checked={sendSlack}
                                    onCheckedChange={(v) => setSendSlack(Boolean(v))}
                                    size='3'
                                    id='send-slack'
                                />
                                <label htmlFor='send-slack'>
                                    <Text size='2'>Send slack varsel</Text>
                                </label>
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
