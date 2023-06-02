import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material'

import { ThemeProvider as StyleThemeProvider } from 'styled-components'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

//Redux
import { Provider } from 'react-redux'
import store from './store/store'

//Components
import ErrorBoundary from './components/Error Boundary'

//Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup/Signup'
import ResetPassword from './pages/ResetPassword'
import ProductsInCategory from './pages/Products In Category'
import Product from './pages/Product'
import Cart from './pages/Cart'
import OrderSuccess from './pages/Order Success/'
import Profile from './pages/Profile'
import Error404 from './pages/Error404'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import AboutUs from './pages/About Us'
import Search from './pages/Search'

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
            <ErrorBoundary>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <StyleThemeProvider theme={theme}>
                            <Provider store={store}>
                                <div className="App">
                                    <Routes>
                                        <Route path="faq" element={<FAQ />} />
                                        <Route
                                            path="search"
                                            element={<Search />}
                                        />
                                        <Route
                                            path="about-us"
                                            element={<AboutUs />}
                                        />
                                        <Route
                                            path="contact"
                                            element={<Contact />}
                                        />
                                        <Route
                                            path="/profile"
                                            element={<Profile />}
                                        />
                                        <Route
                                            path="/login"
                                            element={<Login />}
                                        />
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
                                        <Route
                                            path="/cart"
                                            element={<Cart />}
                                        />
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
                                        <Route
                                            path="*"
                                            element={<Error404 />}
                                        />
                                    </Routes>
                                </div>
                            </Provider>
                        </StyleThemeProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </ErrorBoundary>
        </BrowserRouter>
    )
}

export default App
