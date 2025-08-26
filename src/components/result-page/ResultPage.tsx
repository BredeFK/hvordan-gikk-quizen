import {Result} from '../../data/types'
import {Card, Text} from '@radix-ui/themes'
import './ResultPage.css';
import {useParams} from 'react-router-dom';
import React from 'react';
import NoResultPage from "../no-result-page/NoResultPage";
import QuizResult from "../quiz-result/QuizResult";
import {todayIso} from "../../data/results";
import {Centered} from "../ui/centered/Centered";

export default function ResultPage({results, error, loading}: Readonly<{
    results: Result[],
    error: string | null,
    loading: boolean
}>) {

    const params = useParams<{ date: string }>();
    const selectedDate = params.date ?? todayIso();
    const result: Result | null = React.useMemo(
        () => results.find((r) => r.dateString === selectedDate) ?? null,
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
                <NoResultPage selectedDate={selectedDate} lastResultDay={results[results.length - 1].dateString}/>
            </Centered>
        );
    }


    return (
        <Centered>
            <QuizResult selectedResult={result} availableResults={results}/>
        </Centered>
    );
}
