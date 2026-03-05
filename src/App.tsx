import {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom'
import './App.css'
import {NetworkError, type Result} from "./data/types.ts";
import {Flex, Text} from "@radix-ui/themes";
import {Centered} from "./components/ui/Centered.tsx";
import {UserProvider} from "./data/userContext.tsx";
import Header from "./components/ui/Header.tsx";
import {getResults, todayIso} from "./data/utils.ts";
import ResultPage from "./components/result-page/ResultPage.tsx";
import StatisticsPage from "./components/statistics/StatisticsPage.tsx";
import AuthenticationPage from "./components/authetication/AuthenticationPage.tsx";
import AdminRouter from "./components/admin/AdminRouter.tsx";
import AdminPage from "./components/admin/AdminPage.tsx";
import LoginPage from "./components/authetication/LoginPage.tsx";
import UserPage from "./components/user/UserPage.tsx";
import {ONLY_FRONTEND} from "./data/backend.ts";

export default function App() {
    const [results, setResults] = useState<Result[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const refresh = async () => {
            if (!cancelled) {
                setLoading(true);
                setError(null);
            }
            try {
                const results = await getResults();
                if (!cancelled)
                    setResults(results);
            } catch (error) {
                if (!cancelled) {
                    if (error instanceof NetworkError) {
                        setError(`Network error: ${error.message}`);
                    } else if (error instanceof Error) {
                        setError(`Error: ${error.message}`);
                    } else {
                        setError(`Unknown error: ${error}`)
                    }
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void refresh();
        return () => {
            cancelled = true;
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
                    {!ONLY_FRONTEND && (
                        <>
                            <Route path="/auth/success" element={<AuthenticationPage/>}/>
                            <Route path="/admin" element={<AdminRouter><AdminPage results={results}/></AdminRouter>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/bruker"
                                   element={<AdminRouter><UserPage/></AdminRouter>}/>
                        </>
                    )}
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
