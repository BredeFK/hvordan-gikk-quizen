import axios, {AxiosResponse} from "axios";
import {User} from "./types";

const API_BASE = 'https://api.hvordangikkquizen.no'

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {Accept: "application/json"},
    timeout: 10000,
});


export async function fetchUser(): Promise<User> {
    const res: AxiosResponse<User> = await api.get("/api/user");
    if (res.status !== 200) {
        throw new Error(`HTTP ${res.status}`)
    }
    return res.data;
}

export function startGoogleLogin(): void {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
}

export async function logout(): Promise<void> {
    const result = await api.post("/api/logout");
    if (result.status !== 200) {
        throw new Error(`HTTP ${result.status}`)
    }
    window.location.href = "/";
}
