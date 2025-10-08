import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom'
import ResultPage from './components/result-page/ResultPage'
import StatisticsPage from "./components/statistics/StatisticsPage";
import {Result, ResultEvent} from "./data/types";
import {getResults, todayIso} from "./data/utils";
import {Flex, Text} from "@radix-ui/themes";
import AuthenticationPage from "./components/authetication/AuthenticationPage";
import {Centered} from "./components/ui/Centered";
import Header from "./components/ui/Header";
import AdminRouter from "./components/admin/AdminRouter";
import AdminPage from "./components/admin/AdminPage";
import LoginPage from "./components/authetication/LoginPage";
import {UserProvider} from "./data/userContext";
import UserPage from "./components/user/UserPage";
import {getEventSource} from "./data/backend";

export default function App() {
    const [results, setResults] = React.useState<Result[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;
        let eventSource: EventSource | null = null;

        const refresh = async () => {
            try {
                const results = await getResults();
                if (!cancelled)
                    setResults(results);
            } catch (err) {
                if (!cancelled)
                    setError(err instanceof Error ? err.message : String(err));
            }
        };

        setLoading(true);
        refresh().finally(() => {
            if (!cancelled) setLoading(false);
        });

        const windowHandler = () => {
            void refresh();
        };
        window.addEventListener('results:changed', windowHandler);

        eventSource = getEventSource();
        const esHandler = (event: MessageEvent) => {
            try {
                const resultEvent = JSON.parse(event.data) as ResultEvent;
                console.info(`A result for ${resultEvent.data.date} was just ${resultEvent.type} `
                + `to ${resultEvent.data.score}/${resultEvent.data.total} [${resultEvent.data.quizSource}]`);
            } catch {
                // Do nothing
            }
            void refresh();
        };
        eventSource.addEventListener('result', esHandler as EventListener);

        return () => {
            cancelled = true;
            window.removeEventListener('results:changed', windowHandler);
            if (eventSource) {
                eventSource.removeEventListener('result', esHandler as EventListener);
                eventSource.close();
            }
        };
    }, [])

    return (
        <BrowserRouter>
            <UserProvider>
                <Header/>
                <Routes>
                    <Route path="/" element={<Navigate to={`/${todayIso()}`} replace/>}/>
                    <Route path="/:date" element={<ResultPage results={results} error={error} loading={loading}/>}/>
                    <Route path="/statistikk"
                           element={<StatisticsPage results={results} error={error} loading={loading}/>}/>
                    <Route path="/auth/success" element={<AuthenticationPage/>}/>
                    <Route path="/admin" element={<AdminRouter><AdminPage results={results}/></AdminRouter>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/bruker"
                           element={<AdminRouter><UserPage/></AdminRouter>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </UserProvider>
        </BrowserRouter>

    );
}

function NotFound() {
    return (
        <Centered>
            <Flex direction='column' gap='2' align='center'>
                <Text size='9' weight='bold'>404</Text>
                <Text color='gray'>Denne siden finnes ikke</Text>
            </Flex>
        </Centered>
    )
}
