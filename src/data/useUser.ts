import {use} from "react";
import {UserContext} from "./userContextDef";
import type {UserContextType} from "./userContextDef";

export function useUser(): UserContextType {
    const ctx = use(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within UserProvider");
    }
    return ctx;
}
