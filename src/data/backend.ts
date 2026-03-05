import axios, {AxiosError} from "axios";
import {NetworkError, type RawResult, type User} from "./types.ts";

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://hvordan-gikk-quizen-backend.fly.dev';
export const ONLY_FRONTEND = import.meta.env.VITE_ONLY_FRONTEND === 'true';
console.info('ONLY_FRONTEND', ONLY_FRONTEND);

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {Accept: "application/json"},
    timeout: 10000,
});

api.interceptors.response.use(
    (res) => res,
    (e: unknown) => {
        if (e instanceof AxiosError && e.message === "Network Error") {
            throw new NetworkError("The back-end is down", e);
        }
        throw e;
    }
);

export async function fetchUser(): Promise<User> {
    const res = await api.get<User>("/api/user");
    return res.data;
}

export function startGoogleLogin(): void {
    globalThis.location.href = `${API_BASE}/oauth2/authorization/google`;
}

export async function logout(): Promise<void> {
    await api.post("/api/logout");
    globalThis.location.href = "/";
}

export async function fetchResults(): Promise<RawResult[]> {
    if (ONLY_FRONTEND) {
        return await parseCsv()
    }
    const res = await api.get<RawResult[]>(`/api/result/all?localFile=${ONLY_FRONTEND}`);
    return res.data;
}

export async function fetchResult(dateString: string): Promise<RawResult | null> {
    if (ONLY_FRONTEND) {
        const results = await parseCsv();
        return results.find(value => value.date === dateString) || null;
    }
    try {
        const res = await api.get<RawResult>(`/api/result/${dateString}?localFile=${ONLY_FRONTEND}`);
        return res.data;
    } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 404) {
            return null;
        }
        throw e;
    }
}

export async function saveResult(result: RawResult, sendSlack: boolean): Promise<RawResult> {
    const res = await api.post<RawResult>(`/api/result?sendSlack=${sendSlack}`, result);
    return res.data;
}

async function parseCsv(): Promise<RawResult[]> {
    const fileName = 'result_050326.csv'
    try {
        const response = await fetch(`/${fileName}`);
        if (!response.ok) {
            console.error(`HTTP ${response.status}`)
            return [] as RawResult[]
        }
        const csv = await response.text()
        return parseCsvResults(csv)
    } catch (e: unknown) {
        throw new Error(`Failed to fetch ${fileName}`, {cause: e});
    }
}


function parseCsvResults(csv: string): RawResult[] {
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
        return {
            date: cols[0],
            score: Number(cols[1]),
            total: Number(cols[2]),
        } as RawResult
    })
}

