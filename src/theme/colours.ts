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

export const rainbowColors: string[] = [
    '#5f2879',
    '#00418d',
    '#00c2de',
    '#00ba71',
    '#fa8901',
    '#f43545',
    '#5f2879',
]
