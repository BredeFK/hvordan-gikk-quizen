import axios, {AxiosError} from "axios";
import {NetworkError, type RawResult, type User} from "./types.ts";

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://hvordan-gikk-quizen-backend.fly.dev';

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
    const res = await api.get<RawResult[]>("/api/result/all");
    return res.data;
}

export async function fetchResult(dateString: string): Promise<RawResult | null> {
    try {
        const res = await api.get<RawResult>(`/api/result/${dateString}`);
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
