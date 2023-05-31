import { useEffect } from 'react'

import { HomeOutlined } from '@mui/icons-material'
import { Typography, Link, Breadcrumbs, Stack } from '@mui/material'

import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

//Components
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

//Assets
import ImageValues from '../../assets/images/image-values.webp'

//About Us Styled
const AboutUsStyled = styled.div`
    width: 100%;
`

//Section
const Section = styled.section`
    width: 100%;
    padding: 80px 280px;
    display: flex;
    flex-direction: column;
    gap: 80px;
`

//Hero
const Hero = styled.div`
    width: 100%;
    height: 80vh;
    overflow: hidden;
    position: relative;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

//Overlay
const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.palette.primary.light};
`

//Heading
const Heading = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

//Toolbar
const Toolbar = styled.div`
    height: 5rem;
    padding: 0 180px;
    margin-top: 48px;
    border-top: 1px solid #0000002f;
    border-bottom: 1px solid #0000002f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
`

const AboutUs = () => {
    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Scroll to top
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [location.pathname])

    return (
        <AboutUsStyled>
            <Header />
            <Hero>
                <Overlay />
                <img
                    src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                    alt="an image of 4 people looking at computer screens in an office environment"
                />
                <Heading>
                    <Typography variant="h2" color="secondary">
                        About Us
                    </Typography>
                    <Typography color="secondary" variant="h6">
                        Know us, about our company, our goals and commitments
                        towards our customers.
                    </Typography>
                </Heading>
            </Hero>
            <Toolbar>
                <Breadcrumbs>
                    <Link
                        component={RouterLink}
                        to="/"
                        color="inherit"
                        underline="hover"
                    >
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap="4px"
                        >
                            <HomeOutlined /> Home
                        </Stack>
                    </Link>
                    <Typography color="primary">About Us</Typography>
                </Breadcrumbs>
            </Toolbar>
            <Section>
                <Stack gap="16px">
                    <Typography variant="h4">Who we are?</Typography>
                    <Typography textAlign="left">
                        Bazaar is an an online marketplace that offers customers
                        the convenience of shopping and purchasing a variety of
                        products from various categories, and recommends the
                        best products and deals based on their shopping habits
                        and interests, with just a few clicks. Customers can
                        shop from the comfort of their homes and have their
                        orders shipped and delivered straight to their doorstep
                    </Typography>

                    <Typography textAlign="left">
                        We've been in the industry for +8 years and have been
                        serving our customers with the best in class services
                        and way to do daily shopping online very easy,
                        comforting and pleasing for our customers, and in
                        addition we offers the best prices on products with
                        premium quality.
                    </Typography>
                </Stack>
                <Stack gap="16px">
                    <Typography variant="h4">Our core values</Typography>
                    <Typography textAlign="left">
                        We belive in creating an enabling environment for our
                        customers so they can easily shop online without any
                        worries or hassle and we believe in creating postive
                        imapactful changes the way we do shopping online in this
                        digital era.
                    </Typography>
                    <img
                        src={ImageValues}
                        alt="image listing core values of our company"
                    />
                </Stack>
            </Section>
            <Footer />
        </AboutUsStyled>
    )
}

export default AboutUs
