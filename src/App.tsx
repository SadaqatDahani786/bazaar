import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material'

import { ThemeProvider as StyleThemeProvider } from 'styled-components'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

//Redux
import { Provider } from 'react-redux'
import store from './store/store'

//Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signuo/Signup'
import ResetPassword from './pages/ResetPassword'
import ProductsInCategory from './pages/Products In Category'
import Product from './pages/Product'
import Cart from './pages/Cart'
import OrderSuccess from './pages/Order Success/'

//CSS
import './App.css'

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
                light: '#f22e4540',
                main: '#F22E46',
                dark: '#c4051b',
                contrastText: '#ffffff',
            },
            success: {
                light: '#10EE8340',
                main: '#10EE83',
                dark: '#05c96a',
                contrastText: '#ffffff',
            },
            info: {
                light: '#1698CF40',
                main: '#1698CF',
                dark: '#0a81b4',
                contrastText: '#ffffff',
            },
            warning: {
                light: '#EEA12F40',
                main: '#EEA12F',
                dark: '#c77e11',
                contrastText: '#000000',
            },
        },
    })

    return (
        <BrowserRouter>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <StyleThemeProvider theme={theme}>
                        <Provider store={store}>
                            <div className="App">
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/signup"
                                        element={<Signup />}
                                    />
                                    <Route
                                        path="/reset-password/:token"
                                        element={<ResetPassword />}
                                    />
                                    <Route
                                        path="/order_success"
                                        element={<OrderSuccess />}
                                    />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route
                                        path="/products/:category/:page"
                                        element={<ProductsInCategory />}
                                    />
                                    <Route
                                        path="/product/:id"
                                        element={<Product />}
                                    />
                                    <Route
                                        path="/dashboard/"
                                        element={
                                            <Navigate
                                                to="/dashboard/overview"
                                                replace={true}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/dashboard/:path"
                                        element={<Dashboard />}
                                    />
                                    <Route path="/" element={<Home />} />
                                </Routes>
                            </div>
                        </Provider>
                    </StyleThemeProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </BrowserRouter>
    )
}

export default App
