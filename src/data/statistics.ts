import {Result, StatisticsInfo, TableData} from './types'

export default function calculateStatistics(results: Result[]): StatisticsInfo | null {
    const resultsDescending = [...results].sort((a, b) => b.date.getTime() - a.date.getTime())

    const totalNumberOfQuizzes = results.length
    const averageScore = round1(avg(results.map(r => r.score)))
    const medianScore = round1(median(results.map(r => r.score)))
    const perfectCount = results.filter(d => d.score === d.total).length

    const lastBestDay = resultsDescending.find(r => r.percentage === 100) ?? null
    const lastWorstDay = resultsDescending.reduce(
        (a, b) => (b.percentage < a.percentage ? b : a),
        resultsDescending[0]
    )

    const averageByWeekday = groupAverageByWeekday(results)
    const averageByMonth = groupAverageByMonth(results)
    const trendLastMonth = new Map<string, number>(
        resultsDescending.slice(0, 31).map(r => [formatDateShort(r.date), r.percentage])
    )

    return {
        totalNumberOfQuizzes,
        averageScore,
        medianScore,
        perfectCount,
        lastBestDay,
        lastWorstDay,
        averageByWeekday,
        averageByMonth,
        trendLastMonth,
    }
}

function sum(numbers: number[]) {
    return numbers.reduce((a, b) => a + b, 0)
}

function avg(numbers: number[]) {
    return numbers.length ? sum(numbers) / numbers.length : 0
}

export function round1(number: number) {
    return Math.round(number * 10) / 10
}

export function formatDate(date: Date): string {
    const day = date.toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'short'
    }).replace(/\.$/, '')

    if (date.getFullYear() === new Date().getFullYear()) {
        return day
    }
    return day + ' ' + date.getFullYear()
}

function formatDateShort(date: Date): string {
    return date.toLocaleDateString('nb-NO', {
        day: '2-digit',
        month: '2-digit'
    }).replace(/\.$/, '')
}

function formatMonth(date: Date): string {
    return capitalise(date.toLocaleDateString('nb-NO', {
        month: 'long',
        year: 'numeric'
    }))
}

function formatDay(date: Date) {
    return capitalise(date.toLocaleDateString('nb-NO', {
        weekday: 'long'
    }))
}

function capitalise(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function median(numbers: number[]) {
    if (numbers.length === 0) return 0
    const a = [...numbers].sort((x, y) => x - y)
    const mid = Math.floor(a.length / 2)
    return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2
}

function groupAverageByWeekday(results: Result[]): TableData[] {
    const order = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag']
    const map = new Map<string, number[]>()
    results.forEach(d => {
        const key = formatDay(d.date)
        map.set(key, [...(map.get(key) || []), d.percentage])
    })
    return order
        .filter(k => map.has(k))
        .map(k => ({
            key: k,
            value: avg(map.get(k)!)
        }))
}

function groupAverageByMonth(days: Result[]): TableData[] {
    const key = (d: Result) => formatMonth(d.date)
    const map = new Map<string, number[]>()
    days.forEach(d => {
        const k = key(d)
        map.set(k, [...(map.get(k) || []), d.percentage])
    })
    return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, arr]) => ({
            key: month,
            value: avg(arr)
        }))
}
