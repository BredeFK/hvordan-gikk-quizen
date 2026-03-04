import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {ThemeProvider} from "@mui/material";
import "@radix-ui/themes/styles.css";
import {Theme} from '@radix-ui/themes'
import './index.css'
import App from './App.tsx'
import {darkThemePalette} from "./theme/colours.ts";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={darkThemePalette}>
            <Theme appearance="dark" accentColor="jade" grayColor='auto' radius='large'>
                <div id='dp-portal'></div>
                <App/>
            </Theme>
        </ThemeProvider>
    </StrictMode>,
)
