import type {MouseEvent} from "react";

export interface Result {
    date: Date;
    percentage: number;
    dateString: string;
    score: number;
    total: number;
}

export interface RawResult {
    date: string;
    score: number;
    total: number;
}

export interface BadgeInputProps {
    value?: string;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
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

export class NetworkError extends Error {
    constructor(message: string, cause?: unknown) {
        super(message, {cause});
        this.name = "NetworkError";
    }
}
