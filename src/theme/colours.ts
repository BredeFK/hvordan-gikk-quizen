import {createTheme} from '@mui/material';

export const darkThemePalette = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            light: '#74b39d',
            main: '#52A185',
            dark: '#39705d',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#b38074',
            main: '#A16152',
            dark: '#704339',
            contrastText: '#ffffff',
        },
    }
})

export const heatmapColors: string[] = [
    '#a50026', // 0
    '#d73027', // 1
    '#f46d43', // 2
    '#fdae61', // 3
    '#fee08b', // 4
    '#ffffbf', // 5
    '#d9ef8b', // 6
    '#a6d96a', // 7
    '#66bd63', // 8
    '#1a9850', // 9
    '#006837', // 10
];

export function colorFromScore(score: number): string {
    return heatmapColors[score]
}

export function colorArrayFromScores(scores: number[]): string[]{
    return scores.map(colorFromScore)
}
