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
    '#4d0000', // 0
    '#660000', // 1
    '#800000', // 2
    '#a50026', // 3
    '#d73027', // 4
    '#f46d43', // 5
    '#fdae61', // 6
    '#fee08b', // 7
    '#a6d96a', // 8
    '#1a9850', // 9
    '#006837', // 10
];

export const rainbowColors: string[] = [
    '#5f2879',
    '#00418d',
    '#00c2de',
    '#00ba71',
    '#fa8901',
    '#f43545',
    '#5f2879',
]

export function colorFromScore(score: number): string {
    return heatmapColors[score]
}
