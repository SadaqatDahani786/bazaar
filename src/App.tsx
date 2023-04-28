import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { ThemeProvider as StyleThemeProvider } from 'styled-components'

//CSS
import './App.css'

//Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

/**
 ** ======================================================
 ** Component [App]
 ** ======================================================
 */
function App() {
    /**
     ** **
     ** ** ** App Theme
     ** **
     */
    const theme = createTheme({
        typography: {
            fontFamily: ['Lato', 'Arial', 'sans-serif'].join(','),
        },
        palette: {
            primary: {
                light: '#00000088',
                main: '#000000',
                dark: '#140f0f',
                contrastText: '#ffffff',
            },
            secondary: {
                light: '#ffffff88',
                main: '#ffffff',
                dark: '#ffe3e3',
                contrastText: '#000000',
            },
            error: {
                light: '#f22e4588',
                main: '#F22E46',
                dark: '#d8152b',
                contrastText: '#ffffff',
            },
            success: {
                light: '#10EE8388',
                main: '#10EE83',
                dark: '#05c96a',
                contrastText: '#ffffff',
            },
            info: {
                light: '#1698CF88',
                main: '#1698CF',
                dark: '#0a81b4',
                contrastText: '#ffffff',
            },
            warning: {
                light: '#EEA12F88',
                main: '#EEA12F',
                dark: '#c77e11',
                contrastText: '#000000',
            },
        },
    })

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <StyleThemeProvider theme={theme}>
                    <div className="App">
                        {/* <Home /> */}
                        <Dashboard />
                    </div>
                </StyleThemeProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
