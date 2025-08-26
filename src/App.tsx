import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom'
import ResultPage from './components/result-page/ResultPage'
import StatisticsPage from "./components/statistics/StatisticsPage";
import {Result} from "./data/types";
import {parseCsv, todayIso} from "./data/results";

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
            <Routes>
                <Route path="/" element={<Navigate to={`/${todayIso()}`} replace/>}/>
                <Route path="/:date" element={<ResultPage results={results} error={error} loading={loading}/>}/>
                <Route path="/statistikk"
                       element={<StatisticsPage results={results} error={error} loading={loading}/>}/>
            </Routes>
        </BrowserRouter>

    );
}
