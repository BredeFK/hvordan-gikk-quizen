import axios, {AxiosError, AxiosResponse} from "axios";
import {RawResult, Result, User} from "./types";

const API_BASE = process.env.REACT_APP_API_BASE ?? 'https://api.hvordangikkquizen.no';

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {Accept: "application/json"},
    timeout: 10000,
});


export async function fetchUser(): Promise<User> {
    try {
        const res: AxiosResponse<User> = await api.get("/api/user");
        if (res.status !== 200) {
            throw new Error(`HTTP ${res.status}`);
        }
        return res.data;
    } catch {
        throw new Error("Unable to fetch user");
    }
}

export function startGoogleLogin(): void {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
}

export async function logout(): Promise<void> {
    try {
        const result = await api.post("/api/logout");
        if (result.status !== 200) {
            throw new Error(`HTTP ${result.status}`);
        }
        window.location.href = "/";
    } catch {
        throw new Error("Unable to logout");
    }
}

export async function fetchResults(): Promise<RawResult[]> {
    try {
        const results = await api.get("/api/result/all")
        if (results.status !== 200) {
            throw new Error(`HTTP ${results.status}`);
        }
        return results.data
    } catch {
        throw new Error("Unable to fetch results");
    }
}

export async function fetchResult(dateString: string): Promise<RawResult | null> {
    try {
        const result = await api.get(`/api/result/${dateString}`);
        if (result.status === 200 || result.status === 404) {
            return result.data
        }
        throw new Error(`HTTP ${result.status}`);
    } catch (e: unknown) {
        if (e instanceof AxiosError && e.response?.status === 404) {
            return null
        }
        throw new Error("Unable to fetch result");
    }
}

export async function saveResult(result: RawResult): Promise<RawResult> {
    try {
        const res = await api.post("/api/result", result);
        if (res.status !== 200) {
            throw new Error(`HTTP ${res.status}`);
        }
        return res.data;
    } catch {
        throw new Error("Unable to save result");
    }
}
