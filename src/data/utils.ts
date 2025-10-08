import {RawResult, Result} from './types'
import {colorFromScore} from "../theme/colours";
import {fetchResults} from "./backend";

export function todayIso(): string {
    return toIso(new Date());
}

export function toIso(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export function fallback(email?: string): string {
    if (!email) {
        return "?"
    }
    const emailParts = email.split('@');
    if (emailParts[0].includes('.') && emailParts[0].split('.').length > 1) {
        const names = emailParts[0].split('.');
        return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase()
    }
    return emailParts[0].charAt(0).toUpperCase();
}

export async function getResults(): Promise<Result[]> {
    try {
        const rawResults = await fetchResults()
        if (rawResults.length === 0) {
            return [] as Result[]
        }
        return extendResults(rawResults)
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw e
        }
        throw new Error('Failed to fetch results from backend')
    }
}

function extendResults(results: RawResult[]): Result[] {
    return results.map(rawResult => {
        const percentage = percentageFromScore(rawResult.score, rawResult.total)
        return {
            dateString: rawResult.date.toString(),
            date: new Date(rawResult.date),
            score: rawResult.score,
            total: rawResult.total,
            percentage: percentage,
            colour: colorFromScore(rawResult.score),
            quizSource: rawResult.quizSource
        } as Result
    })
}

export function percentageFromScore(score: number, total: number): number {
    return Math.max(0, Math.min(100, Math.round((score / total) * 100)))
}
