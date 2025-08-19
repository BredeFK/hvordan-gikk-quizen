import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom'
import ResultPage from './components/result-page/ResultPage'

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={`/${todayIso()}`} replace/>}/>
                <Route path="/:date" element={<ResultPage/>}/>
            </Routes>
        </BrowserRouter>

    );
}
