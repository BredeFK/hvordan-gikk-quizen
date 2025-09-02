import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom'
import ResultPage from './components/result-page/ResultPage'
import StatisticsPage from "./components/statistics/StatisticsPage";
import {Result} from "./data/types";
import {parseCsv, todayIso} from "./data/results";
import {Flex, Text} from "@radix-ui/themes";
import AuthenticationPage from "./components/authetication/AuthenticationPage";
import {Centered} from "./components/ui/Centered";
import Header from "./components/ui/Header";
import AdminRouter from "./components/admin/AdminRouter";
import LoginPage from "./components/authetication/LoginPage";

export default function App() {
    const [results, setResults] = React.useState<Result[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        parseCsv()
            .then(setResults)
            .catch(setError)
            .finally(() =>
                setLoading(false)
            );
    }, [])

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Navigate to={`/${todayIso()}`} replace/>}/>
                <Route path="/:date" element={<ResultPage results={results} error={error} loading={loading}/>}/>
                <Route path="/statistikk"
                       element={<StatisticsPage results={results} error={error} loading={loading}/>}/>
                <Route path="/auth/success" element={<AuthenticationPage/>}/>
                <Route path="/admin" element={(
                    <AdminRouter><Centered><Text>Admin</Text></Centered></AdminRouter>
                )}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/bruker" element={<AdminRouter><Centered><Text>Bruker</Text></Centered></AdminRouter>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
/        </BrowserRouter>

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
