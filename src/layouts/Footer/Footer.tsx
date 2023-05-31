import { ArrowUpward } from '@mui/icons-material'
import {
    Button,
    Fab,
    Link,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'
import { useEffect } from 'react'

import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import { getManyCategoryAsync } from '../../store/categoryReducer'

//Hooks
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { getAllCategoryDescendants } from '../../utils/getAllCategoryDescendants'

/**
 ** **
 ** ** ** Styled Components
 ** **s
 */
//Footer
const FooterStyled = styled.div`
    width: 100%;
    min-height: 100vh;
    background: ${(props) => props.theme.palette.secondary.main};
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 48px 8px;
    }
`

//Footer Row
const Row = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: row;
    gap: 16px;
    padding: 16px 0;
    flex-wrap: wrap;

    &:last-child {
        border-top: 1px solid ${(props) => props.theme.palette.primary.light};
        gap: 8px;
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
        flex-direction: column;
        gap: 32px;

        &:nth-child(1) {
            flex-direction: column-reverse;
        }
    }
`

//Newsletter
const Newsletter = styled.div`
    flex: 0 0 460px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 16px;

    ${(props) => props.theme.breakpoints.down('sm')} {
        flex-direction: column;
        flex: 0 0 auto;
    }
`

//Newsletter Input
const NewsletterInput = styled.div`
    background: ${(props) => props.theme.palette.primary.main};
    padding: 8px;
    display: flex;
    alignitems: center;
    gap: 8px;

    & input {
        color: ${(props) => props.theme.palette.secondary.main};

        &::placeholder {
            opacity: 0.7;
        }
    }
`

//Footer Logo
const FooterLogo = styled.div`
    font-size: clamp(4.6rem, 10vw, 10rem);
    text-transform: uppercase;
    font-weight: 200;
    width: max-content;
    height: max-content;
`

//Nav
const Nav = styled.nav`
    align-self: baseline;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    text-align: left;
    flex: 0 0 calc(100% / 6 - 32px);
`

//Nav List
const NavList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

//Nav List Item
const NavListItem = styled.li`
    font-size: 24px;
    list-style: none;
    font-weight: 300;
`

/**
 ** ======================================================
 ** Component [Footer]
 ** ======================================================
 */
const Footer = () => {
    //Hooks
    const { width } = useWindowDimensions()
    const theme = useTheme()
    const categories = useAppSelector((state) => state.category.data)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getManyCategoryAsync([]))
    }, [])

    return (
        <FooterStyled>
            <Row>
                <Newsletter>
                    <Typography variant="h4" fontWeight="bold">
                        Newsletter
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight={300}
                        color="black"
                        lineHeight={1}
                    >
                        Subscribe to get special offers, free giveaways and
                        once-in-a-lifetime deals.
                    </Typography>
                    <NewsletterInput>
                        <TextField
                            fullWidth={true}
                            placeholder="Enter your email"
                            variant="outlined"
                            color="primary"
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            style={{ borderRadius: 0 }}
                        >
                            Subscribe
                        </Button>
                    </NewsletterInput>
                </Newsletter>
                <FooterLogo>BAZAAR</FooterLogo>
            </Row>
            <Row>
                <Nav>
                    <Typography variant="h4">Explore</Typography>
                    <NavList>
                        {categories
                            .filter((cat) =>
                                getAllCategoryDescendants(categories, [
                                    'mens-fashion',
                                    'womens-fashion',
                                ]).every((catin) => catin._id !== cat._id)
                            )
                            .splice(0, 6)
                            .map((cat) => (
                                <NavListItem key={cat._id}>
                                    <Link
                                        component={RouterLink}
                                        to={`/products/${cat.slug}/1`}
                                        underline="hover"
                                    >
                                        {cat.name}
                                    </Link>
                                </NavListItem>
                            ))}
                    </NavList>
                </Nav>
                <Nav>
                    <Typography variant="h4">Men</Typography>
                    <NavList>
                        {(getAllCategoryDescendants(categories, [
                            'mens-fashion',
                        ]).length > 4
                            ? getAllCategoryDescendants(categories, [
                                  'mens-fashion',
                              ]).splice(0, 4)
                            : getAllCategoryDescendants(categories, [
                                  'mens-fashion',
                              ])
                        ).map((cat) => (
                            <NavListItem key={cat._id}>
                                <Link
                                    component={RouterLink}
                                    to={`/products/${cat.slug}/1`}
                                    underline="hover"
                                >
                                    {cat.name}
                                </Link>
                            </NavListItem>
                        ))}
                    </NavList>
                </Nav>
                <Nav>
                    <Typography variant="h4">Women</Typography>
                    <NavList>
                        {(getAllCategoryDescendants(categories, [
                            'womens-fashion',
                        ]).length > 5
                            ? getAllCategoryDescendants(categories, [
                                  'womens-fashion',
                              ]).splice(0, 5)
                            : getAllCategoryDescendants(categories, [
                                  'womens-fashion',
                              ])
                        ).map((cat) => (
                            <NavListItem key={cat._id}>
                                <Link
                                    component={RouterLink}
                                    to={`/products/${cat.slug}/1`}
                                    underline="hover"
                                >
                                    {cat.name}
                                </Link>
                            </NavListItem>
                        ))}
                    </NavList>
                </Nav>
                <Nav>
                    <Typography variant="h4">Support</Typography>
                    <NavList>
                        <NavListItem>
                            <Link
                                component={RouterLink}
                                to="/about-us"
                                underline="hover"
                            >
                                About Us
                            </Link>
                        </NavListItem>
                        <NavListItem>
                            <Link
                                component={RouterLink}
                                to="/contact"
                                underline="hover"
                            >
                                Contact
                            </Link>
                        </NavListItem>
                        <NavListItem>
                            <Link
                                component={RouterLink}
                                to="/faq"
                                underline="hover"
                            >
                                FAQ
                            </Link>
                        </NavListItem>
                    </NavList>
                </Nav>
                <Nav>
                    <Typography variant="h4">Connect</Typography>
                    <NavList>
                        <NavListItem>
                            <Link
                                target="_blank"
                                href="https://instagram.com/"
                                underline="hover"
                            >
                                Instagram
                            </Link>
                        </NavListItem>
                        <NavListItem>
                            <Link
                                target="_blank"
                                href="https://facebook.com/"
                                underline="hover"
                            >
                                Facebook
                            </Link>
                        </NavListItem>
                        <NavListItem>
                            <Link
                                target="_blank"
                                href="https://twitter.com/"
                                underline="hover"
                            >
                                Twitter
                            </Link>
                        </NavListItem>
                    </NavList>
                </Nav>
                <Fab
                    onClick={() =>
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                    }
                    style={{
                        alignSelf:
                            width <= theme.breakpoints.values.sm
                                ? 'flex-end'
                                : 'flex-start',
                    }}
                >
                    <ArrowUpward />
                </Fab>
            </Row>
            <Row>
                <Typography
                    fontWeight={300}
                    variant="h5"
                    textTransform="uppercase"
                    padding="8px 0"
                    textAlign="center"
                    alignSelf="center"
                    width="100%"
                >
                    &copy; Bazaar Inc 2023. All rights reserved.
                </Typography>
                {/* <NavList
                    style={{
                        flexDirection:
                            width <= theme.breakpoints.values.sm
                                ? 'column'
                                : 'row',
                        gap:
                            width <= theme.breakpoints.values.sm
                                ? '8px'
                                : '24px',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                    }}
                >
                    <NavListItem>
                        <Link underline="hover">Privacy</Link>
                    </NavListItem>
                    <NavListItem>
                        <Link underline="hover">Terms of use</Link>
                    </NavListItem>
                </NavList> */}
            </Row>
        </FooterStyled>
    )
}

export default Footer
