import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "@radix-ui/themes/styles.css";
import {Theme} from '@radix-ui/themes'
import {createTheme, ThemeProvider} from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const darkTheme = createTheme({
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

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <Theme appearance="dark" accentColor="jade" grayColor='auto' radius='large'>
                <div id='dp-portal'></div>
                <App/>
            </Theme>
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
