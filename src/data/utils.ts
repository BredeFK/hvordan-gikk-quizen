import {Result} from './types'
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
        const results = await fetchResults()
        if (results.length === 0) {
            return [] as Result[]
        }
        return extendResults(results)
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw e
        }
        throw new Error('Failed to fetch results from backend')
    }
}

function extendResults(results: Result[]): Result[] {
    return results.map(result => {
        const percentage = percentageFromScore(result.score, result.total)
        // TODO : This is messy, cleanup needed!
        return {
            dateString: result.date.toString(),
            date: new Date(result.date),
            score: result.score,
            total: result.total,
            percentage: percentage,
            colour: colorFromScore(result.score)
        } as Result
    })
}

export function percentageFromScore(score: number, total: number): number {
    return Math.max(0, Math.min(100, Math.round((score / total) * 100)))
}
