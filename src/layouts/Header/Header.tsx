import React, { useState } from 'react'

import {
    Badge,
    Card,
    Drawer,
    Icon,
    Link,
    TextField,
    Typography,
    InputAdornment,
    Divider,
} from '@mui/material'
import {
    SearchSharp,
    PersonOutlineSharp,
    AccountCircle,
    ShoppingBagOutlined,
    EmailOutlined,
    PhoneOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowRightOutlined,
    KeyboardArrowUpOutlined,
    ArrowBack,
} from '@mui/icons-material'

import styled from 'styled-components'
import { motion } from 'framer-motion'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Header
const HeaderStyled = styled.header`
    width: 100%;
    height: 152px;
    display: flex;
    flex-direction: column;
    padding: 0 48px;

    ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 8px;
    }
`

//App Bar
const AppBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex: 0 0 48px;

    ${(props) => props.theme.breakpoints.down('md')} {
        background: ${(props) => props.theme.palette.primary.main};
        overflow-x: scroll;
    }
`

//App Bar Item
const AppBarItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    flex: 1;

    &:nth-child(2) {
        display: flex;
        justify-content: center;
    }

    &:nth-child(3) {
        display: flex;
        justify-content: flex-end;
    }

    &:nth-child(1),
    &:nth-child(3) {
        ${(props) => props.theme.breakpoints.down('md')} {
            display: none;
        }
    }
`

//Pill
const Pill = styled.div`
    width: clamp(20rem, 40vw, 60rem);
    height: 32px;
    border-radius: 24px;
    background-color: ${(props) => props.theme.palette.primary.main};
    display: flex;
    justify-content: center;
    align-items: center;

    ${(props) => props.theme.breakpoints.down('md')} {
        background: none;
    }
`

//Nav Bar
const NavBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
    flex: 1;
`

//Nav
const Nav = styled.nav`
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &:nth-child(1) > ul,
    &:nth-child(3) li:nth-of-type(1),
    &:nth-child(3) li:nth-of-type(2) {
        ${(props) => props.theme.breakpoints.down('md')} {
            display: none;
        }
    }
`

//Nav List
const NavList = styled.ul`
    display: flex;
    padding: 0;
    position: relative;
`

//Nav List Item
const NavListItem = styled.li`
    list-style: none;
    font-size: 1.2rem;
    padding: 16px;
    display: flex;

    ${(props) => props.theme.breakpoints.down('lg')} {
        padding: 16px 8px;
    }

    &:nth-child(2):hover > div {
        display: flex;
    }

    &:nth-child(2):hover > a {
        color: ${(props) => props.theme.palette.primary.light};
    }
`

//Nav Sub Menu
const NavSubMenu = styled.div`
    min-height: 300px;
    background: ${(props) => props.theme.palette.primary.main};
    position: absolute;
    top: 60px;
    left: 0;
    width: calc(100vw - 48px * 2);
    padding: 48px;
    display: flex;
    justify-content: space-between;
    display: none;

    ${(props) => props.theme.breakpoints.down('lg')} {
        left: -48px;
        width: 100vw;
        padding: 48px 0;
    }
`

//Nav Column
const NavCol = styled.div`
    flex: 1;
    padding: 0 24px;

    &:not(:last-child) {
        border-right: 1px solid
            ${(props) => props.theme.palette.secondary.light};
    }

    &:nth-child(4),
    &:nth-child(5) {
        display: flex;
        justify-content: center;
    }
`

//Nav Link
const NavLink = styled(Link)`
    color: ${(props) => props.theme.palette.primary.main};
    display: flex;
    justify-content: center;
    cursor: pointer;
    padding-bottom: 16px;

    &:hover {
        color: ${(props) => props.theme.palette.primary.light};
    }
`

//Image
const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: 'cover';
`

//Card
const CardStyled = styled(Card)`
    maxwidth: 16rem;
    height: 100%;
    position: relative;

    &:hover > div {
        display: flex;
    }
`

//Card Details
const CardDetails = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 5rem;
    background: ${(props) => props.theme.palette.primary.main};
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 16px;
`

//Drawer Content
const DrawerContent = styled.div`
    width: 346px;
    overflow-x: hidden;
    height: 100%;
    display: 'flex';
    flex-direction: 'row';
    background: ${(props) => props.theme.palette.secondary.main};
`

//Drawer Header
const DrawerHeader = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    height: 140px;
`

//Drawer Nav
const DrawerNav = styled.div`
    width: 100%;
    position: relative;
    padding: 0 16px;
    font-family: 'Lato';
`

//Sub Drawer Nav
const SubDrawerNav = styled(motion.div)`
    padding: 16px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    list-style: none;
    background: ${(props) => props.theme.palette.secondary.main};
`

//Drawer Menu List
const DrawerMenuList = styled.ul`
    list-style: none;
`

//Drawer Nav Link
const DrawerNavLink = styled(Link)`
    padding: 8px 0;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    &:hover {
        font-weight: 600;
    }
`

//Menu Button
const MenuButton = styled.a`
    width: 2.8rem;
    height: calc(0.6rem * 2 + 15px);
    display: none;

    ${(props) => props.theme.breakpoints.down('md')} {
        display: block;
    }

    &:hover span,
    &:hover span::before,
    &:hover span::after {
        background: ${(props) => props.theme.palette.primary.light};
    }

    & span {
        display: block;
        width: 2.8rem;
        height: 5px;
        background: ${(props) => props.theme.palette.primary.main};
        position: relative;
        margin-top: calc(0.6rem * 2);
        justify-self: center;

        &,
        &::before,
        &::after {
            display: block;
            width: 2.8rem;
            height: 5px;
            background-color: currentColor;
            transition: all 0.3s ease;
        }

        &::before,
        &::after {
            content: '';
            position: absolute;
            left: 0;
        }

        &::before {
            top: -0.6rem;
        }

        &::after {
            top: 0.6rem;
        }
    }
`

//Back To Menu Button
const BackToMenuButton = styled.button`
    margin: 8px 0;
    width: 100%;
    display: flex;
    align-items: flex-end;
    font-weight: bold;
    font-size: 14px;
    background: none;
    border: none;
    cursor: pointer;
    &:hover {
        color: ${(props) => props.theme.palette.primary.light};
    }
`

//Logo
const Logo = styled.div`
    font-size: 4.2rem;
    font-family: 'Playfair Display';
`

/**
 ** ======================================================
 ** Component [Header]
 ** ======================================================
 */
const Header = () => {
    /**
     ** **
     ** ** ** Dummy Data
     ** **
     */
    const categories = [
        {
            name: "Men's Fashion",
            slug: 'men-fashion',
            parent: 'none',
        },
        {
            name: "Women's Fashion",
            slug: 'women-fashion',
            parent: 'none',
        },
        {
            name: 'Health & Beauty',
            slug: 'health-and-beauty',
            parent: 'none',
        },
        {
            name: "Men's Apparels",
            slug: 'men-apparels',
            parent: 'men-fashion',
        },
        {
            name: "Men's Footwears",
            slug: 'men-footwears',
            parent: 'men-fashion',
        },
        {
            name: "Men's Accessories",
            slug: 'men-accessories',
            parent: 'men-fashion',
        },
        {
            name: "Men's Jeans",
            slug: 'men-jeans',
            parent: 'men-apparels',
        },
        {
            name: "Men's TShirts",
            slug: 'men-tshirts',
            parent: 'men-apparels',
        },
        {
            name: "Men's Suits",
            slug: 'men-suits',
            parent: 'men-apparels',
        },
        {
            name: "Women's Apparels",
            slug: 'women-apparels',
            parent: 'women-fashion',
        },
        {
            name: "Women's Footwears",
            slug: 'women-footwears',
            parent: 'women-fashion',
        },
        {
            name: "Women's Accessories",
            slug: 'women-accessories',
            parent: 'women-fashion',
        },
    ]

    /**
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState([
        'men-fashion',
        'men-apparels',
        'men-jeans',
    ])
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [drawerSelectedMenu, setDrawerSelectedMenu] = useState('')

    /**
     ** **
     ** ** ** Methods
     ** **
     */
    //Mouse enter parent category handler
    const mouseEnterParentCategoryHandler = (
        e: React.SyntheticEvent<HTMLLIElement>
    ) => {
        //1) slug of menu selected
        const slug = e.currentTarget.dataset['menu'] || ''

        //2) child of selected menu
        const childCat =
            categories.find((cat) => cat.parent === slug)?.slug || ''

        //3) child of selected menu's child
        const childOfChildCat =
            categories.find((cat) => cat.parent === childCat)?.slug || ''

        //4) update the state
        setSelectedMenu([slug, childCat, childOfChildCat])
    }

    //Mouse enter child category handler
    const mouseEnterChildCategoryHandler = (
        e: React.SyntheticEvent<HTMLLIElement>
    ) => {
        //1) slug of menu selected
        const slug = e.currentTarget.dataset['menu'] || ''

        //2) child of selected menu
        const childCat =
            categories.find((cat) => cat.parent === slug)?.name || ''

        //4) update the state
        setSelectedMenu((state) => [state[0], slug, childCat])
    }

    return (
        <HeaderStyled>
            <AppBar>
                <AppBarItem>
                    <Icon>
                        <PhoneOutlined />
                    </Icon>
                    <Link href="tel:+3533246545521" variant="body2">
                        +353-324-654-5521
                    </Link>
                </AppBarItem>
                <AppBarItem>
                    <Pill>
                        <Link color="secondary" variant="subtitle2">
                            EXPLORE OUR BLACK FRIDAY SALE NOW
                        </Link>
                    </Pill>
                </AppBarItem>
                <AppBarItem>
                    <Icon>
                        <EmailOutlined />
                    </Icon>
                    <Link
                        variant="body2"
                        href="mailto:bazaar.incorporation@gmail.com"
                    >
                        bazaar.incorporation@gmail.com
                    </Link>
                </AppBarItem>
            </AppBar>
            <NavBar>
                <Nav>
                    <NavList>
                        <NavListItem>
                            <NavLink underline="none" color="primary">
                                Home
                            </NavLink>
                        </NavListItem>
                        <NavListItem
                            onMouseEnter={() => setIsMenuOpen(true)}
                            onMouseLeave={() => {
                                setSelectedMenu([
                                    'men-fashion',
                                    'men-apparels',
                                    'men-jeans',
                                ])
                                setIsMenuOpen(false)
                            }}
                        >
                            <NavLink underline="none">
                                Shop
                                <Icon>
                                    {isMenuOpen ? (
                                        <KeyboardArrowUpOutlined />
                                    ) : (
                                        <KeyboardArrowDownOutlined />
                                    )}
                                </Icon>
                            </NavLink>
                            <NavSubMenu>
                                <NavCol>
                                    <ul>
                                        {categories
                                            .filter(
                                                (cat) => cat.parent === 'none'
                                            )
                                            .map((cat) => (
                                                <li
                                                    key={cat.slug}
                                                    onMouseEnter={
                                                        mouseEnterParentCategoryHandler
                                                    }
                                                    data-menu={cat.slug}
                                                >
                                                    <Link
                                                        color="secondary"
                                                        underline="hover"
                                                        variant="subtitle2"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'space-between',
                                                            padding: '8px 0',
                                                            fontWeight:
                                                                cat.slug ===
                                                                selectedMenu[0]
                                                                    ? 'bold'
                                                                    : 'normal',
                                                        }}
                                                    >
                                                        {cat.name}
                                                        {cat.slug ===
                                                            selectedMenu[0] && (
                                                            <Icon
                                                                style={{
                                                                    marginTop:
                                                                        '-5px',
                                                                    color: 'white',
                                                                }}
                                                            >
                                                                <KeyboardArrowRightOutlined />
                                                            </Icon>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </NavCol>
                                <NavCol>
                                    <ul>
                                        {categories
                                            .filter(
                                                (cat) =>
                                                    cat.parent ===
                                                    selectedMenu[0]
                                            )
                                            .map((cat) => (
                                                <li
                                                    key={cat.slug}
                                                    onMouseEnter={
                                                        mouseEnterChildCategoryHandler
                                                    }
                                                    data-menu={cat.slug}
                                                >
                                                    <Link
                                                        color="secondary"
                                                        underline="hover"
                                                        variant="subtitle2"
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            padding: '8px 0',
                                                            fontWeight:
                                                                cat.slug ===
                                                                selectedMenu[1]
                                                                    ? 'bold'
                                                                    : 'normal',
                                                        }}
                                                    >
                                                        {cat.name}

                                                        {cat.slug ===
                                                            selectedMenu[1] && (
                                                            <Icon
                                                                style={{
                                                                    color: 'white',
                                                                    marginTop:
                                                                        '-5px',
                                                                }}
                                                            >
                                                                <KeyboardArrowRightOutlined />
                                                            </Icon>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </NavCol>
                                <NavCol>
                                    <ul>
                                        {categories
                                            .filter(
                                                (cat) =>
                                                    cat.parent ===
                                                    selectedMenu[1]
                                            )
                                            .map((cat) => (
                                                <li
                                                    key={cat.slug}
                                                    data-menu={cat.slug}
                                                >
                                                    <Link
                                                        color="secondary"
                                                        underline="hover"
                                                        variant="subtitle2"
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            padding: '8px 0',
                                                        }}
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </NavCol>
                                <NavCol>
                                    <Link style={{ cursor: 'pointer' }}>
                                        <CardStyled variant="elevation">
                                            <Image src="https://images.unsplash.com/photo-1576087503901-b2a3e3b66672?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDF8fHByb2R1Y3RzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" />
                                            <CardDetails>
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="bold"
                                                    fontFamily="Playfair Display"
                                                    color="secondary"
                                                >
                                                    Top
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="secondary"
                                                >
                                                    Products
                                                </Typography>
                                            </CardDetails>
                                        </CardStyled>
                                    </Link>
                                </NavCol>
                                <NavCol>
                                    <Link style={{ cursor: 'pointer' }}>
                                        <CardStyled variant="elevation">
                                            <Image src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIwfHxwcm9kdWN0c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" />
                                            <CardDetails>
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="bold"
                                                    fontFamily="Playfair Display"
                                                    color="secondary"
                                                >
                                                    New
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="secondary"
                                                >
                                                    Arrivals
                                                </Typography>
                                            </CardDetails>
                                        </CardStyled>
                                    </Link>
                                </NavCol>
                            </NavSubMenu>
                        </NavListItem>
                        <NavListItem>
                            <NavLink underline="none">Deals</NavLink>
                        </NavListItem>
                        <NavListItem>
                            <NavLink underline="none">About Us</NavLink>
                        </NavListItem>
                        <NavListItem>
                            <NavLink underline="none">Contact Us</NavLink>
                        </NavListItem>
                    </NavList>
                    <MenuButton onClick={() => setIsDrawerOpen(true)}>
                        <span></span>
                    </MenuButton>
                    <Drawer
                        open={isDrawerOpen}
                        onClose={() => {
                            setDrawerSelectedMenu('')
                            setIsDrawerOpen(false)
                        }}
                    >
                        <DrawerContent>
                            <DrawerHeader>
                                <Link
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        cursor: 'pointer',
                                    }}
                                    variant="h5"
                                    fontWeight="bold"
                                >
                                    <Icon
                                        style={{ marginRight: '8px' }}
                                        fontSize="large"
                                    >
                                        <AccountCircle fontSize="large" />
                                    </Icon>
                                    Hello, sign in
                                </Link>
                                <TextField
                                    type="search"
                                    placeholder="Search here..."
                                    variant="outlined"
                                    fullWidth={true}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchSharp />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </DrawerHeader>
                            <Divider variant="fullWidth" />
                            <DrawerNav style={{ position: 'relative' }}>
                                <Typography
                                    style={{
                                        paddingTop: '24px',
                                        paddingBottom: '8px',
                                    }}
                                    fontWeight="bold"
                                    variant="h6"
                                    color="primary"
                                >
                                    Explore
                                </Typography>
                                <DrawerMenuList>
                                    <li>
                                        <DrawerNavLink underline="none">
                                            Home
                                        </DrawerNavLink>
                                    </li>
                                    <li>
                                        <DrawerNavLink underline="none">
                                            Deals
                                        </DrawerNavLink>
                                    </li>
                                    <li>
                                        <DrawerNavLink underline="none">
                                            About Us
                                        </DrawerNavLink>
                                    </li>
                                    <li>
                                        <DrawerNavLink underline="none">
                                            Contact Us
                                        </DrawerNavLink>
                                    </li>
                                </DrawerMenuList>
                                <Divider variant="fullWidth" />
                                <Typography
                                    style={{
                                        paddingTop: '24px',
                                        paddingBottom: '8px',
                                    }}
                                    fontWeight="bold"
                                    variant="h6"
                                    color="primary"
                                >
                                    Shop By Category
                                </Typography>
                                <DrawerMenuList>
                                    {categories
                                        .filter((cat) => cat.parent === 'none')
                                        .map((cat) => (
                                            <li key={cat.slug}>
                                                <DrawerNavLink
                                                    underline="none"
                                                    onClick={() =>
                                                        setDrawerSelectedMenu(
                                                            cat.slug
                                                        )
                                                    }
                                                >
                                                    {cat.name}
                                                    <Icon>
                                                        <KeyboardArrowRightOutlined />
                                                    </Icon>
                                                </DrawerNavLink>

                                                <SubDrawerNav
                                                    initial={{
                                                        transform:
                                                            drawerSelectedMenu ===
                                                            cat.slug
                                                                ? 'translateX(0%)'
                                                                : 'translateX(100%)',
                                                    }}
                                                    animate={{
                                                        transform:
                                                            drawerSelectedMenu ===
                                                            cat.slug
                                                                ? 'translateX(0%)'
                                                                : 'translateX(100%)',
                                                    }}
                                                >
                                                    <BackToMenuButton
                                                        onClick={() =>
                                                            setDrawerSelectedMenu(
                                                                ''
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            style={{
                                                                marginRight:
                                                                    '8px',
                                                            }}
                                                        >
                                                            <ArrowBack />
                                                        </Icon>
                                                        MAIN MENU
                                                    </BackToMenuButton>
                                                    <Divider
                                                        style={{
                                                            margin: '16px',
                                                        }}
                                                        variant="fullWidth"
                                                    />
                                                    <Typography
                                                        style={{
                                                            padding: '8px 0',
                                                        }}
                                                        fontWeight="bold"
                                                        variant="h6"
                                                        color="primary"
                                                    >
                                                        {cat.name}
                                                    </Typography>
                                                    <DrawerMenuList>
                                                        {categories
                                                            .filter(
                                                                (catsub) =>
                                                                    catsub.parent ===
                                                                    cat.slug
                                                            )
                                                            .map((catsub) => (
                                                                <li>
                                                                    <DrawerNavLink underline="none">
                                                                        {
                                                                            catsub.name
                                                                        }
                                                                    </DrawerNavLink>
                                                                </li>
                                                            ))}
                                                    </DrawerMenuList>
                                                </SubDrawerNav>
                                            </li>
                                        ))}
                                </DrawerMenuList>
                            </DrawerNav>
                        </DrawerContent>
                    </Drawer>
                </Nav>
                <Logo>
                    <Link underline="none">Bazaar</Link>
                </Logo>
                <Nav style={{ justifyContent: 'flex-end' }}>
                    <NavList>
                        <NavListItem>
                            <Icon>
                                <SearchSharp />
                            </Icon>
                        </NavListItem>
                        <NavListItem>
                            <Icon>
                                <PersonOutlineSharp />
                            </Icon>
                        </NavListItem>
                        <NavListItem>
                            <Badge badgeContent={3} color="primary">
                                <Icon>
                                    <ShoppingBagOutlined />
                                </Icon>
                            </Badge>
                        </NavListItem>
                    </NavList>
                </Nav>
            </NavBar>
        </HeaderStyled>
    )
}

export default Header
