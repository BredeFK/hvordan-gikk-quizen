import {Result} from '../../data/types'
import {Card, Text} from '@radix-ui/themes'
import './ResultPage.css';
import {useNavigate, useParams} from 'react-router-dom';
import React from 'react';
import {todayIso} from "../../data/utils";
import {Centered} from "../ui/Centered";
import ResultCard from "../result-card/ResultCard";
import validator from "validator";
import {formatQuizDate, formatQuizTitle} from "../../data/statistics";
import Loading from "../ui/Loading";

export default function ResultPage({results, error, loading}: Readonly<{
    results: Result[],
    error: string | null,
    loading: boolean
}>) {

    const navigate = useNavigate();

    const params = useParams<{ date: string }>();
    const selectedDate = params.date ?? todayIso();
    const result: Result | null = React.useMemo(
        () => results.find((r) => r.dateString === selectedDate) ?? null,
        [results, selectedDate]
    );

    if (loading) {
        return <Loading loadingText='Leter etter resultater'/>
    }

    if (error) {
        return (
            <Centered>
                <Card size='3' variant='surface'>
                    <Text color='red'>Det er mulig at API'et ikke kjører nå :/</Text>
                </Card>
            </Centered>
        );
    }

    if (result) {
        return <ResultCard
            selectedResult={result}
            selectedDateString={selectedDate}
            availableResults={results}
            title={formatQuizTitle(result.date)}
            subTitle={`Lunsjquiz i Iterate. Denne er fra ${result.quizSource}`}
        />
    }

    if (validator.isDate(selectedDate)) {
        const date = toDateOnly(new Date(selectedDate))
        const today = toDateOnly(new Date())
        if (dayIsWeekend(date)) {
            // In the weekend
            return <ResultCard
                selectedResult={null}
                selectedDateString={selectedDate}
                availableResults={results}
                title={formatQuizDate(date)}
                subTitle='Vi tar ikke quizer i helgene'
            />
        } else if (date > today) {
            // In the future
            return <ResultCard
                selectedResult={null}
                selectedDateString={selectedDate}
                availableResults={results}
                title={formatQuizTitle(date)}
                subTitle='Denne quizen har ikke vært enda'
            />
        } else if (date < today) {
            // In the past
            return <ResultCard
                selectedResult={null}
                selectedDateString={selectedDate}
                availableResults={results}
                title={formatQuizTitle(date)}
                subTitle='Denne quizen tok vi aldri'
            />
        } else {
            // Today, but no result yet
            return <ResultCard
                selectedResult={null}
                selectedDateString={selectedDate}
                availableResults={results}
                title={formatQuizTitle(date)}
                subTitle='Vi har ikke tatt quizen enda, sjekk igjen senere'
            />
        }
    } else {
        const lastValidResult = results[results.length - 1]
        navigate(`/${lastValidResult.dateString}`)
        return null
    }
}

function toDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function dayIsWeekend(date: Date): boolean {
    const day = date.getDay()
    return day === 0 || day === 6
}
