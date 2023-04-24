import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { ThemeProvider as StyleThemeProvider } from 'styled-components'

//CSS
import './App.css'

// Components
import Header from './layouts/Header'
import Carousel from './components/Carousel'
import ProductCardList from './components/Product Card List'
import Grid from './components/Grid'
import Footer from './layouts/Footer'

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
                        <Header />
                        <Carousel
                            slides={[
                                [
                                    {
                                        title: '**Dress like** a gentlemen **with our apparels for men.**',
                                        subtitle: "Men's Fashion",
                                        image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                                    },
                                ],
                                [
                                    {
                                        title: '**Unleash** your gaming **and dominate.**',
                                        subtitle: 'Gaming',
                                        image: 'https://images.unsplash.com/photo-1588590560438-5e27fe3f6b71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1728&q=80',
                                    },
                                ],
                                [
                                    {
                                        title: '**Let boy** grow into a man **with our fine products.**',
                                        subtitle: "Boys' Fashion",
                                        image: 'https://images.unsplash.com/photo-1497169345602-fbb1a307de16?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                                    },
                                    {
                                        title: '**Cute fashionable** clothes **for your princess.**',
                                        subtitle: "Girls' Fashion",
                                        image: 'https://images.unsplash.com/photo-1603285756065-f56453dcaf0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                                    },
                                ],
                                [
                                    {
                                        title: '**Glitter like** moonshine and glow **with our organic beauty products.**',
                                        subtitle: 'Health & Beauty',
                                        image: 'https://plus.unsplash.com/premium_photo-1676583283219-9cfb63303462?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
                                    },
                                    {
                                        title: 'Skin Care',
                                        image: 'https://images.unsplash.com/photo-1559881230-1af605ca3f67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2tpbiUyMGNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                                    },
                                    {
                                        title: 'Fragrances',
                                        image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZnJhZ3JhbmNlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                                    },
                                ],
                            ]}
                        />
                        <ProductCardList
                            title="Discover the latest fashion trends made for you."
                            subtitle="Latest"
                            slides={[
                                {
                                    title: "London Men's Tall Lhotse II  Trench Coat",
                                    image: 'https://images.unsplash.com/photo-1553143820-6bb68bc34679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=674&q=80',
                                    prices: {
                                        price: 160.45,
                                        sale_price: 149.99,
                                    },
                                    isStaffPicked: false,
                                    colors: ['#dfbf57', 'black'],
                                },
                                {
                                    title: "Alex Evenings Women's Cold Shoulder Popover Dress",
                                    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fHdvbWVuJTIwZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                                    prices: {
                                        price: 696.66,
                                    },
                                    isStaffPicked: false,
                                    colors: ['white'],
                                },
                                {
                                    title: "J.M. Haggar Men's Premium Stretch Tailored Fit Suit ",
                                    image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
                                    prices: {
                                        price: 2000.0,
                                        sale_price: 1899.99,
                                    },
                                    isStaffPicked: false,
                                    colors: ['darkblue', 'black'],
                                },
                                {
                                    title: 'Hanes Sport Performance Fleece Pullover Hoodie',
                                    image: 'https://images.unsplash.com/photo-1633292750937-120a94f5c2bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                                    prices: {
                                        price: 864.44,
                                    },
                                    isStaffPicked: false,
                                    colors: ['black', 'white', 'gray'],
                                },
                                {
                                    title: "London Men's Tall Lhotse II  Trench Coat",
                                    image: 'https://images.unsplash.com/photo-1553143820-6bb68bc34679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=674&q=80',
                                    prices: {
                                        price: 160.45,
                                        sale_price: 149.99,
                                    },
                                    isStaffPicked: false,
                                    colors: ['#dfbf57', 'black'],
                                },
                                {
                                    title: "Alex Evenings Women's Cold Shoulder Popover Dress",
                                    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fHdvbWVuJTIwZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                                    prices: {
                                        price: 696.66,
                                    },
                                    isStaffPicked: false,
                                    colors: ['white'],
                                },
                                {
                                    title: "J.M. Haggar Men's Premium Stretch Tailored Fit Suit ",
                                    image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
                                    prices: {
                                        price: 2000.0,
                                        sale_price: 1899.99,
                                    },
                                    isStaffPicked: false,
                                    colors: ['darkblue', 'black'],
                                },
                                {
                                    title: 'Hanes Sport Performance Fleece Pullover Hoodie',
                                    image: 'https://images.unsplash.com/photo-1633292750937-120a94f5c2bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                                    prices: {
                                        price: 864.44,
                                    },
                                    isStaffPicked: false,
                                    colors: ['black', 'white', 'gray'],
                                },
                            ]}
                        />
                        <Grid
                            items={[
                                {
                                    name: 'Home Decoration',
                                    slug: 'home-decoration',
                                    image: 'https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZSUyMGRlY29yYXRpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                                },
                                {
                                    name: 'Fragrances',
                                    slug: 'fragrances',
                                    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fGZyYWdyYW5jZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                                },
                                {
                                    name: 'Toys & Games',
                                    slug: 'toys-and-games',
                                    image: 'https://images.unsplash.com/photo-1596068587619-e4b11c7a3488?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHRveXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                                },
                                {
                                    name: 'Gaming',
                                    slug: 'gaming',
                                    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FtaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                                },
                                {
                                    name: 'Shampoos & Conditioners',
                                    slug: 'shampoo-and-conditioner',
                                    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                                },
                                {
                                    name: 'Smartphones',
                                    slug: 'smartphones',
                                    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fHNtYXJ0cGhvbmVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                                },
                                {
                                    name: 'Makeup',
                                    slug: 'makeup',
                                    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bWFrZSUyMHVwfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                                },
                                {
                                    name: 'Health & Beauty',
                                    slug: 'health-and-beauty',
                                    image: 'https://images.unsplash.com/photo-1606570109843-5c1ff8e7cc1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                                },
                                {
                                    name: 'Sports & Outdoors',
                                    slug: 'sports-and-outdoors',
                                    image: 'https://images.unsplash.com/photo-1587314021014-efb61d5925bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c3BvcnRzJTIwYW5kJTIwb3V0ZG9vcnN8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                                },
                                {
                                    name: 'Groceries',
                                    slug: 'groceries',
                                    image: 'https://images.unsplash.com/photo-1543168256-418811576931?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGdyb2Nlcmllc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                                },
                                {
                                    name: 'Kitchen Appliances',
                                    slug: 'kitchen-appliances',
                                    image: 'https://images.unsplash.com/photo-1591924450983-b8f7587ea332?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                                },
                                {
                                    name: 'Mother & Baby',
                                    slug: 'mother-and-baby',
                                    image: 'https://images.unsplash.com/photo-1601512310580-da458161fcab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fG1vdGhlciUyMGFuZCUyMGJhYnl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                                },
                            ]}
                        />
                        <Footer />
                    </div>
                </StyleThemeProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
