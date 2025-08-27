import {Result} from './types'
import {colorFromScore} from "../theme/colours";

export function todayIso(): string {
    return new Date().toISOString().slice(0, 10)
}

export async function parseCsv(): Promise<Result[]> {
    try {
        const response = await fetch('/results.csv')
        if (!response.ok) {
            console.error(`HTTP ${response.status}`)
            return [] as Result[]
        }
        const csv = await response.text()
        return parseCsvResults(csv)
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw e
        }
        throw new Error('Failed to fetch results.csv')
    }
}

function parseCsvResults(csv: string): Result[] {
    const lines = csv.trim().split(/\r?\n/)
    if (lines.length === 0) {
        return []
    }

    const headers = lines[0].split(',')
    if (headers.length !== 3 && headers[0] === 'date' && headers[1] === 'score' && headers[2] === 'total') {
        throw new Error('CSV header must include: date,score,total')
    }

    const rows = lines.slice(1).filter(Boolean)
    return rows.map(line => {
        const cols = line.split(',').map(c => c.trim())
        const score = Number(cols[1])
        const total = Number(cols[2])
        const percentage = percentageFromScore(score, total)
        return {
            dateString: cols[0],
            date: new Date(cols[0]),
            score: score,
            total: total,
            percentage: percentage,
            colour: colorFromScore(score)
        } as Result
    })
}

function percentageFromScore(score: number, total: number): number {
    return Math.max(0, Math.min(100, Math.round((score / total) * 100)))
}
