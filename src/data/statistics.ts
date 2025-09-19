import {Result, StatisticsInfo, TableData, TrendValue} from './types'

export default function calculateStatistics(results: Result[], trendSize: number): StatisticsInfo | null {
    const resultsDescending = [...results].sort((a, b) => b.date.getTime() - a.date.getTime())

    const totalNumberOfQuizzes = results.length
    const averageScore = round1(avg(results.map(r => r.score)))
    const medianScore = round1(median(results.map(r => r.score)))
    const perfectCount = results.filter(d => d.score === d.total).length

    const lastBestDay = resultsDescending.find(r => r.percentage === 100) ?? null
    const lastWorstDay = resultsDescending.reduce(
        (a, b) => (b.score < a.score ? b : a),
        resultsDescending[0]
    )

    const averageByWeekday = groupAverageByWeekday(results)
    const averageByMonth = groupAverageByMonth(results)
    const trendLastMonth = new Map<string, TrendValue>(
        results.slice(-trendSize).map(r => [
            formatDateShort(r.date), {
                value: r.score,
                colour: r.colour,
                dateString: r.dateString
            }
        ]))

    return {
        totalNumberOfQuizzes,
        averageScore,
        medianScore,
        perfectCount,
        lastBestDay,
        lastWorstDay,
        averageByWeekday,
        averageByMonth,
        trendLastQuizzes: trendLastMonth,
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

function formatDate(date: Date): string {
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
    return `${date.getDate()}/${date.getMonth() + 1}`
}

function formatMonth(date: Date): string {
    return capitalise(date.toLocaleDateString('nb-NO', {
        month: 'long',
        year: 'numeric'
    }))
}

export function formatAftenpostenDate(date: Date): string {
    const weekday = date.toLocaleDateString('nb-NO', {weekday: 'long'})
    const dateString = date.toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
    return `${capitalise(weekday)} ${dateString}`
}

export function formatAftenpostenTitle(date: Date): string {
    const isToday = date.toDateString() === new Date().toDateString()

    return `${isToday ? 'Dagens quiz' : 'Quiz'}: ${formatAftenpostenDate(date)}`
}

export function relationDate(date: Date): string {
    const today = new Date().toLocaleDateString()
    if (today === date.toLocaleDateString()) {
        return 'i dag!'
    }
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()
    if (yesterday === date.toLocaleDateString()) {
        return 'i går'
    }
    return formatDate(date)
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
    const map = new Map<string, number[]>()
    results.forEach(d => {
        const key = formatDay(d.date)
        map.set(key, [...(map.get(key) || []), d.score])
    })
    return Array.from(map.entries())
        .map(([key, value]) => ({
            key: key,
            value: avg(value),
            length: value.length
        })).sort((x, y) => y.value - x.value)
}

function groupAverageByMonth(days: Result[]): TableData[] {
    const map = new Map<string, number[]>();
    days.forEach(d => {
        const ym = `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, "0")}`;
        const arr = map.get(ym) || [];
        arr.push(d.score);
        map.set(ym, arr);
    });

    return Array.from(map.entries())
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([ym, values]) => {
            const [y, m] = ym.split("-");
            return {
                key: formatMonth(new Date(Number(y), Number(m) - 1)),
                value: avg(values),
                length: values.length,
            };
        });
}

