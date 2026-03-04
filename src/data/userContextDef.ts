import {createContext} from "react";
import type {User} from "./types.ts";

export interface UserContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
