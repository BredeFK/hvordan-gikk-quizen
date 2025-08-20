import {Result} from '../../data/types'
import {Box, Card, Flex, Text} from '@radix-ui/themes'
import './ResultPage.css';
import {useParams} from 'react-router-dom';
import React from 'react';
import NoResultPage from "../no-result-page/NoResultPage";
import QuizResult from "../quiz-result/QuizResult";

export default function ResultPage() {
    const params = useParams<{ date: string }>();
    const selectedDate = params.date ?? todayIso();
    const [results, setResults] = React.useState<Result[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const response = await fetch('/results.csv');
                if (!response.ok) {
                    console.error(`HTTP ${response.status}`);
                    return;
                }
                const csv = await response.text();
                const parsed = parseCsvResults(csv);
                if (alive) {
                    setResults(parsed);
                }
            } catch (e: any) {
                if (alive) setError(e.message ?? 'Unknown error');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const result: Result | null = React.useMemo(
        () => results.find((r) => r.date === selectedDate) ?? null,
        [results, selectedDate]
    );

    if (loading) {
        return (
            <Centered>
                <Card size='3' variant='surface'>
                    <Text color='gray'>Laster…</Text>
                </Card>
            </Centered>
        );
    }

    if (error) {
        return (
            <Centered>
                <Card size='3' variant='surface'>
                    <Text color='red'>Sjekk at <code>results.json</code> filen finnes og er gyldig.</Text>
                </Card>
            </Centered>
        );
    }

    if (!result) {
        return (
            <Centered>
                <NoResultPage selectedDate={selectedDate}
                              today={todayIso()}
                              lastResultDay={results[results.length - 1].date}/>
            </Centered>
        );
    }


    return (
        <Centered>
            <QuizResult result={result}/>
        </Centered>
    );
}


function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

function Centered({children}: Readonly<React.PropsWithChildren<{}>>) {
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

function parseCsvResults(csv: string): Result[] {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length === 0) {
        return [];
    }

    const headers = lines[0].split(',');
    if (headers.length !== 3 && headers[0] === 'date' && headers[1] === 'score' && headers[2] === 'total') {
        throw new Error('CSV header must include: date,score,total');
    }

    const rows = lines.slice(1).filter(Boolean);
    return rows.map(line => {
        const cols = line.split(',').map(c => c.trim());
        return {date: cols[0], score: Number(cols[1]), total: Number(cols[2])} as Result;
    });
}
