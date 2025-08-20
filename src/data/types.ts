import React from "react";
import {Theme} from "@radix-ui/themes";

export interface Result {
    date: Date;
    percentage: number;
    color: React.ComponentProps<typeof Theme>['accentColor'];
    dateString: string;
    score: number;
    total: number;
}

export interface BadgeInputProps {
    value?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
