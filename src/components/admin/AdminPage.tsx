import React from 'react';
import {createPortal} from 'react-dom';
import {Box, Button, Card, Flex, Text, TextField, Checkbox, Badge} from '@radix-ui/themes';
import {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {nb as norway} from 'date-fns/locale';
import {Centered} from '../ui/Centered';
import {RawResult, Result} from '../../data/types';
import {toIso} from "../../data/utils";
import './AdminPage.css';
import {fetchResult, saveResult, fetchUsers} from "../../data/backend";
import DatePickerBadge, {injectHeatmapCss} from "../ui/DatePickerBadge";

registerLocale('nb', norway);

export default function AdminPage({results}: Readonly<{ results: Result[] }>) {
    const today = React.useMemo(() => new Date(), []);
    const [selectedDate, setSelectedDate] = React.useState<Date>(today);
    const [score, setScore] = React.useState<string>('');
    const [total, setTotal] = React.useState<string>('10');
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [sendSlack, setSendSlack] = React.useState<boolean>(true);
    const [allUsers, setAllUsers] = React.useState<string[]>([]);
    const [participants, setParticipants] = React.useState<string[]>([]);
    const [participantQuery, setParticipantQuery] = React.useState<string>("");
    const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    const [userLoadError, setUserLoadError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const isoDate = toIso(selectedDate);
        injectHeatmapCss()
        fetchResult(isoDate)
            .then((result: RawResult | null) => {
                setError(null)
                if (result) {
                    setScore(String(result.score));
                    setTotal(String(result.total));
                    setParticipants(result.participants ?? []);
                } else {
                    setScore('');
                    setTotal('10');
                    setParticipants([]);
                }
            })
            .catch(() => {
                setError('Kunne ikke hente resultat')
                setScore('')
                setTotal('10')
                setParticipants([])
            });
    }, [selectedDate]);

    React.useEffect(() => {
        fetchUsers()
            .then((users) => {
                setAllUsers(users);
                setUserLoadError(null);
            })
            .catch(() => setUserLoadError('Kunne ikke hente brukere'));
    }, []);

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
                    participants: participants,
                } as RawResult,
                sendSlack).then(() => {
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
                            {/*
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
                            */}
                            <Flex direction='column' gap='1'>
                                <Text size='2'>Deltakere</Text>
                                <Box
                                    ref={anchorRef}
                                    style={{position: 'relative'}}
                                    onFocus={() => setDropdownOpen(true)}
                                    onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
                                >
                                    <TextField.Root
                                        placeholder='Søk etter deltaker...'
                                        value={participantQuery}
                                        onChange={(e) => setParticipantQuery(e.target.value)}
                                        onClick={() => setDropdownOpen(true)}
                                    />
                                    <SuggestionList
                                        open={dropdownOpen}
                                        anchorRef={anchorRef}
                                        allUsers={allUsers}
                                        query={participantQuery}
                                        alreadySelected={participants}
                                        onPick={(name) => {
                                            setParticipants(prev => Array.from(new Set([...prev, name])));
                                            setParticipantQuery("");
                                            setDropdownOpen(true);
                                        }}
                                    />
                                </Box>
                                {userLoadError && <Text color='red'>{userLoadError}</Text>}
                                {participants.length > 0 && (
                                    <Flex wrap='wrap' gap='2' mt='2' style={{maxWidth: '100%'}}>
                                        {participants.map((p) => (
                                            <Badge key={p} color='gray' variant='soft' size='2' asChild
                                                   style={{maxWidth: '100%'}}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    maxWidth: '100%',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {p}
                                                    <button type='button'
                                                            onClick={() => setParticipants(prev => prev.filter(x => x !== p))}
                                                            style={{
                                                                cursor: 'pointer',
                                                                border: 'none',
                                                                background: 'transparent'
                                                            }}>
                                                        ✕
                                                    </button>
                                                </span>
                                            </Badge>
                                        ))}
                                    </Flex>
                                )}
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

function SuggestionList({open, anchorRef, allUsers, query, alreadySelected, onPick}: Readonly<{
    open: boolean;
    anchorRef: React.RefObject<HTMLDivElement | null>;
    allUsers: string[];
    query: string;
    alreadySelected: string[];
    onPick: (name: string) => void;
}>) {
    const q = query.trim().toLowerCase();
    const suggestions = React.useMemo(() => {
        const base = allUsers.filter(n => !alreadySelected.includes(n));
        const filtered = q ? base.filter(n => n.toLowerCase().includes(q)) : base;
        return filtered.slice(0, 12);
    }, [allUsers, alreadySelected, q]);

    const [pos, setPos] = React.useState<{ left: number; top: number; width: number } | null>(null);
    React.useEffect(() => {
        const update = () => {
            const el = anchorRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setPos({left: rect.left, top: rect.bottom + 4, width: rect.width});
        };
        if (open) update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [open, anchorRef, query, allUsers, alreadySelected]);

    if (!open || suggestions.length === 0 || !pos) return null;

    const dropdown = (
        <Box
            mt='1'
            style={{
                position: 'fixed',
                left: pos.left,
                top: pos.top,
                width: pos.width,
                zIndex: 1000,
                border: '1px solid var(--gray-6)',
                borderRadius: 6,
                padding: 6,
            }}
        >
            <Flex direction='column' gap='1'>
                {suggestions.map((s: string) => (
                    <Button
                        key={s}
                        variant='ghost'
                        color='gray'
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onPick(s);
                        }}
                        style={{justifyContent: 'flex-start'}}
                    >
                        {s}
                    </Button>
                ))}
            </Flex>
        </Box>
    );
    return createPortal(dropdown, document.body);
}
