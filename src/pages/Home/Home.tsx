import { useEffect, useState } from 'react'

import { Button, Typography, useTheme } from '@mui/material'

import styled from 'styled-components'

//Components
import Header from '../../layouts/Header'
import Carousel from '../../components/Carousel'
import ProductCardList from '../../components/Product Card List'
import Grid from '../../components/Grid'
import Footer from '../../layouts/Footer'
import CardSlider from '../../components/Card Slider'

//Hooks
import useWindowDimensions from '../../hooks/useWindowDimensions'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Home Styled
const HomeStyled = styled.div``

//Section
const Section = styled.section`
    width: 100%;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-top: 1px solid ${(props) => props.theme.palette.grey['300']};
    padding: 160px 48px;

    ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 80px 16px;
    }

    &:nth-of-type(3) {
        padding-left: 0;
        padding-right: 0;

        ${(props) => props.theme.breakpoints.down('sm')} {
            padding-left: 16px;
            padding-right: 16px;
        }
    }

    &:nth-of-type(7) {
        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        padding: 0;
        height: 100vh;
    }
`

//Wrapper
const Wrapper = styled.div`
    width: 100%;
    height: 120%;
`
const Heading = styled(Typography)`
    padding-bottom: 160px;
    font-family: 'Playfair Display';

    ${(props) => props.theme.breakpoints.down('sm')} {
        padding-bottom: 80px;
    }

    & span {
        font-weight: bold;
        font-style: italic;
    }
`

//Details
const Details = styled.div`
    position: absolute;
    top: 40%;
    right: 48px;
    max-width: 580px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 24px;

    ${(props) => props.theme.breakpoints.down('sm')} {
        left: 0;
        width: 100%;
        padding: 0 8px;
    }
`

/**
 ** ======================================================
 ** Component [Home]
 ** ======================================================
 */
const Home = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const [numSlidesHistory, setNumSlidesHistory] = useState(6)
    const [numSlidesStaffPicked, setNumSlidesStaffPicked] = useState(3)

    const theme = useTheme()
    const windowDimensions = useWindowDimensions()

    /*
     ** **
     ** ** ** Methods
     ** **
     */

    //Set no of slides to show on window resize
    useEffect(() => {
        //History
        if (windowDimensions.width >= theme.breakpoints.values.lg) {
            setNumSlidesHistory(6)
        } else if (windowDimensions.width >= theme.breakpoints.values.md) {
            setNumSlidesHistory(4)
        } else if (windowDimensions.width >= theme.breakpoints.values.sm) {
            setNumSlidesHistory(2)
        } else if (windowDimensions.width >= theme.breakpoints.values.xs) {
            setNumSlidesHistory(1)
        }

        //Staff picked
        if (windowDimensions.width >= theme.breakpoints.values.lg) {
            setNumSlidesStaffPicked(3)
        } else if (windowDimensions.width >= theme.breakpoints.values.md) {
            setNumSlidesStaffPicked(2)
        } else if (windowDimensions.width >= theme.breakpoints.values.xs) {
            setNumSlidesStaffPicked(1)
        }
    }, [windowDimensions])

    return (
        <HomeStyled>
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
            <Section>
                <Heading variant="h2">Shop By Category</Heading>
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
            </Section>
            <Section>
                <Heading variant="h2">
                    Staff Picked{' '}
                    <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                        Fashion
                    </span>
                </Heading>
                <Wrapper>
                    <CardSlider
                        size="lg"
                        showNextPreview={false}
                        slidesToShow={numSlidesStaffPicked}
                        slides={[
                            {
                                title: 'Amoretu Women Summer Tunic Dress',
                                image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80',
                                prices: {
                                    price: 1336.66,
                                },
                                isStaffPicked: true,
                                colors: ['white', 'pink'],
                            },
                            {
                                title: 'Black Tuxedo 3 PC Suit with Plaid Vest + Bow Tie',
                                image: 'https://images.unsplash.com/photo-1592878897400-43fb1f1cc324?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDJ8fG1lbiUyMHN1aXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                                prices: {
                                    price: 2699.99,
                                    sale_price: 2455.66,
                                },
                                isStaffPicked: true,
                                colors: ['black'],
                            },
                            {
                                title: 'Nike Ultra Durable Very Comfy Premium Style Shoes',
                                image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fG5pa2UlMjBzaG9lc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                                prices: {
                                    price: 999.99,
                                },
                                isStaffPicked: true,
                                colors: ['red', 'green', 'white'],
                            },
                        ]}
                    />
                </Wrapper>
            </Section>
            <ProductCardList
                title="Discover what's trending this week in Gaming."
                subtitle="Trending"
                slides={[
                    {
                        title: 'Sony PS5 Disk Edition - 2TB Storage',
                        image: 'https://images.unsplash.com/photo-1605296830714-7c02e14957ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGxheXN0YXRpb24lMjA1fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                        isStaffPicked: false,
                        prices: {
                            price: 12234,
                            sale_price: 34424,
                        },
                        colors: ['white', 'black'],
                    },
                    {
                        title: 'XBox One Dual Shock Controller',
                        image: 'https://images.unsplash.com/photo-1655976796204-308e6f3deaa8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                        isStaffPicked: false,
                        prices: {
                            price: 310.45,
                        },
                        colors: ['white', 'black', 'red'],
                    },
                    {
                        title: 'Logitech G502  Gaming Mice',
                        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1028&q=80',
                        isStaffPicked: false,
                        prices: {
                            price: 99.99,
                        },
                        colors: ['white', 'gray'],
                    },
                    {
                        title: 'Sony Whc005 Noise Cancelling Gaming Headset',
                        image: 'https://images.unsplash.com/photo-1550009158-baab1dbdb5cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
                        isStaffPicked: false,
                        prices: {
                            price: 449.99,
                            sale_price: 439.99,
                        },
                        colors: ['white', 'gray'],
                    },
                ]}
            />
            <ProductCardList
                title="Take a look what we've found for you."
                subtitle="Just For You"
                slides={[
                    {
                        title: 'Ray-Ban Multi Shade Sunglasses',
                        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
                        isStaffPicked: false,
                        prices: {
                            price: 110.66,
                            sale_price: 99.99,
                        },
                        colors: ['lightgrey'],
                    },
                    {
                        title: 'Stay Wild Victory Sign Skull Hand Logo TShirt',
                        image: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fHRzaGlydHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                        isStaffPicked: true,
                        prices: {
                            price: 95.66,
                            sale_price: 84.14,
                        },
                        colors: ['black', 'white'],
                    },
                    {
                        title: "Men's Premium Quality Full Leather Jacket",
                        image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
                        isStaffPicked: false,
                        prices: {
                            price: 445.64,
                        },
                        colors: ['black', 'brown'],
                    },
                    {
                        title: 'Mens Plain White Baseball Cap Mesh Back',
                        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aGF0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                        isStaffPicked: false,
                        prices: {
                            price: 46.66,
                        },
                        colors: ['white'],
                    },
                ]}
            />
            <Section>
                <Heading variant="h2">
                    Your Browsing <span>History</span>
                </Heading>
                <Wrapper>
                    <CardSlider
                        showNextPreview={false}
                        slidesToShow={numSlidesHistory}
                        size="sm"
                        slides={[
                            {
                                image: 'https://images.unsplash.com/photo-1570088727237-68500d217455?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bGlwc3RpY2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1611042553484-d61f84d22784?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fGhvbWUlMjBkZWNvcmF0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
                            },
                        ]}
                    />
                </Wrapper>
            </Section>
            <Section>
                <img src="https://images.unsplash.com/photo-1544377208-215a63786183?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1276&q=80" />
                <Details>
                    <Typography
                        color="secondary"
                        fontFamily="Playfair Display"
                        fontWeight="bold"
                        variant="h2"
                    >
                        Deals & Promotions
                    </Typography>
                    <Typography color="secondary" variant="h5">
                        Hurry up and save huge with big discounts on variety of
                        deals just for you.
                    </Typography>
                    <Wrapper>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            style={{
                                padding: '1.5rem 2rem',
                                borderRadius: '0px',
                            }}
                        >
                            <Typography variant="h5">See Deals</Typography>
                        </Button>
                    </Wrapper>
                </Details>
            </Section>
            <Footer />
        </HomeStyled>
    )
}

export default Home
