import React from "react";

export interface Result {
    date: Date;
    percentage: number;
    colour: string;
    dateString: string;
    score: number;
    total: number;
    quizSource: string;
}

export interface RawResult {
    date: string;
    score: number;
    total: number;
    quizSource: string;
}

export interface BadgeInputProps {
    value?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface TableData {
    key: string;
    value: number;
    length: number;
}

export interface StatisticsInfo {
    totalNumberOfQuizzes: number;
    averageScore: number;
    medianScore: number;
    perfectCount: number;
    lastBestDay: Result | null;
    lastWorstDay: Result | null;
    averageByWeekday: TableData[];
    averageByMonth: TableData[];
    trendLastQuizzes: Map<string, TrendValue>;
}

export interface TrendValue {
    value: number;
    colour: string;
    dateString: string;
}

export interface User {
    id?: string;
    authenticated: boolean;
    email?: string;
    givenName?: string;
    familyName?: string;
    picture?: string;
}

export interface ResultEvent {
    type: EventType;
    user: string;
    data: RawResult;
}

enum EventType {
    UPDATED,
    CREATED,
    DELETED
}

