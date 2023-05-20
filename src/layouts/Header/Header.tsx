import React, { SyntheticEvent, useEffect, useState } from 'react'

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
    IconButton,
    Box,
    CardContent,
    CardMedia,
    Button,
    Avatar,
    Stack,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
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
    CloseOutlined,
    DeleteOutline,
    AddOutlined,
    RemoveOutlined,
    ArrowForward,
    ExpandMoreOutlined,
    Dashboard,
    AdjustOutlined,
} from '@mui/icons-material'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import { getUserAsync } from '../../store/userReducer'
import { setUser, logoutAsync } from '../../store/authReducer'
import { getManyCategoryAsync } from '../../store/categoryReducer'

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
    top: 63px;
    left: 0;
    width: calc(100vw - 48px * 2);
    padding: 48px;
    display: flex;
    justify-content: space-between;
    z-index: 100;
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

//TextField Quantity
const TextFieldQuantity = styled(TextField)`
    width: 40px;

    & input {
        padding: 0px;
        text-align: center;
    }
`

//Drawer Cart
const DrawerCart = styled.div`
    width: 380px;
    height: 100%;
    background: ${(props) => props.theme.palette.secondary.main};
    padding: 48px;
`

//Drawer Cart Header
const DrawerCartHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 48px 0;
    padding-top: 0;
    border-bottom: 1px solid black;
`

//Drawer Cart Body
const DrawerCartBody = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;
    height: 75%;
    overflow: auto;
    padding: 48px 0;
`

//Drawer Cart Footer
const DrawerCartFooter = styled.div`
    width: 100%;
`

//Logo
const Logo = styled.div`
    font-size: 4.2rem;
    font-family: 'Playfair Display';
`

//Stack Styled
const StackStyled = styled(Stack)`
    & > nav {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1000;
        background: ${(props) => props.theme.palette.secondary.main};
    }

    &:hover > nav {
        display: block;
    }
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

    const defaultCartItems = [
        {
            id: 1,
            title: 'Product 1',
            image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            price: 999.99,
            quantity: 2,
            variations: [
                {
                    name: 'Color',
                    value: 'Red',
                },
                {
                    name: 'Size',
                    value: 'L',
                },
            ],
        },
        {
            id: 2,
            title: 'Product 2',
            image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            price: 699.99,
            quantity: 1,
            variations: [
                {
                    name: 'Color',
                    value: 'White',
                },
                {
                    name: 'Size',
                    value: 'XL',
                },
            ],
        },
    ]

    /**
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const user = useAppSelector((state) => state.auth.data)
    const categories = useAppSelector((state) => state.category.data)
    const dispatch = useAppDispatch()

    //Cart
    const [cartItems, setCartItems] = useState(defaultCartItems)
    const [quantityInputsDefaultValues, setQuantityInputsDefaultValues] =
        useState(
            defaultCartItems.map((item) => ({
                value: item.quantity,
                id: item.id,
            }))
        )

    //State
    const [drawerSelectedMenu, setDrawerSelectedMenu] = useState('')
    const [selectedMenu, setSelectedMenu] = useState<string[]>([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)

    //Navigation
    const navigate = useNavigate()

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Set user
    useEffect(() => {
        //1) Get user id and validate
        const id = localStorage.getItem('user_id')

        //2) Validate
        if (!id || user) return

        //2) Fetch and set logged in user details
        dispatch(
            getUserAsync({
                id,
                cb: (user) => {
                    dispatch(setUser(user))
                },
            })
        )

        dispatch(getManyCategoryAsync())
    }, [])

    //Set menu
    useEffect(() => {
        //1) Validate
        if (!categories || categories.length <= 1) return

        //2) Set menu
        selectMenu()
    }, [categories])

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
            categories.find((cat) => cat.parent?.slug === slug)?.slug || ''

        //3) child of selected menu's child
        const childOfChildCat =
            categories.find((cat) => cat.parent?.slug === childCat)?.slug || ''

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
            categories.find((cat) => cat.parent?.slug === slug)?.name || ''

        //4) update the state
        setSelectedMenu((state) => [state[0], slug, childCat])
    }

    //Remove item from cart handler
    const removeItemFromCartHandler = (
        e: SyntheticEvent<HTMLButtonElement>
    ) => {
        //1) Get Id
        const id = e.currentTarget.dataset.id

        //2) Validate
        if (!id) return

        //3) Update cart items by removing the item to be delete
        const updItems = cartItems.filter((item) => item.id !== parseInt(id))
        setCartItems(updItems)
    }

    //Quantity input fields handler
    const quantityInputfieldHandler = (
        e: SyntheticEvent<HTMLButtonElement>
    ) => {
        //1) Get id and type
        const id = e.currentTarget.dataset.id
        const type = e.currentTarget.dataset.type as 'INC' | 'DEC'

        //2) Validate
        if (!id || !type) return

        //3) Update quantity by increasing or decreasing
        const updItems = quantityInputsDefaultValues.map((item) => {
            if (
                (item.id === parseInt(id) &&
                    type === 'DEC' &&
                    item.value - 1 > 0) ||
                (type === 'INC' && item.value + 1 <= 100)
            ) {
                return {
                    ...item,
                    value:
                        type === 'INC' ? (item.value += 1) : (item.value -= 1),
                }
            }
            return item
        })

        //4)
        setQuantityInputsDefaultValues(updItems)
    }

    //OnChange handler
    const onQuantityChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        //1) Get Id
        const id = e.currentTarget.parentElement?.parentElement?.dataset.id
        let val = parseInt(e.currentTarget.value)

        //2) Validate
        if (!id) return

        //3) Set zero for invalid values
        if (!val || val < 0 || val > 100 || Number.isNaN(val)) {
            val = 0
        }

        //4) Update state
        const updQuantityValues = quantityInputsDefaultValues.map((qValue) => {
            if (qValue.id === parseInt(id)) return { ...qValue, value: val }
            return qValue
        })
        setQuantityInputsDefaultValues(updQuantityValues)
    }

    //OnBlur handler
    const onQuantityBlurHandler = () => {
        //1) Find items to remove with quantity <= 0
        const updateItems = cartItems.filter((item) =>
            quantityInputsDefaultValues.some(
                (qtItem) => qtItem.id === item.id && qtItem.value > 0
            )
        )

        //2) Update state
        setCartItems(updateItems)
    }

    //Click logout handler
    const clickLogoutHandler = () => {
        dispatch(logoutAsync())
    }

    //selectedMenu
    const selectMenu = () => {
        //1) Hold new value
        const newMenu = []

        //2) Find parent, child of parent and child of child
        const parent = categories.find((cat) => !cat.parent)
        const childOfParent = categories.find(
            (cat) => cat.parent?.slug === parent?.slug
        )
        const childOfChild = categories.find(
            (cat) => cat.parent?.slug === childOfParent?.slug
        )

        //3) Push all into new menu
        newMenu.push(parent?.slug || '')
        newMenu.push(childOfParent?.slug || '')
        newMenu.push(childOfChild?.slug || '')

        //4) Update selected menu with new menu
        setSelectedMenu(newMenu)
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
                            <Link
                                component={RouterLink}
                                to="/"
                                underline="none"
                                color="primary"
                                sx={{ ':hover': { color: 'text.secondary' } }}
                            >
                                Home
                            </Link>
                        </NavListItem>
                        <NavListItem
                            onMouseEnter={() => setIsMenuOpen(true)}
                            onMouseLeave={() => {
                                setIsMenuOpen(false)
                                selectMenu()
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
                                            .filter((cat) => !cat.parent)
                                            .map((cat) => (
                                                <li
                                                    key={cat.slug}
                                                    onMouseEnter={
                                                        mouseEnterParentCategoryHandler
                                                    }
                                                    data-menu={cat.slug}
                                                >
                                                    <Link
                                                        to={`/products/${cat.slug}/1`}
                                                        component={RouterLink}
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
                                                        selectedMenu[0] ? (
                                                            selectedMenu[1] ? (
                                                                <KeyboardArrowRightOutlined />
                                                            ) : (
                                                                <AdjustOutlined fontSize="inherit" />
                                                            )
                                                        ) : (
                                                            ''
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
                                                    cat.parent?.slug ===
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
                                                        to={`/products/${cat.slug}/1`}
                                                        component={RouterLink}
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
                                                        selectedMenu[1] ? (
                                                            selectedMenu[2] ? (
                                                                <KeyboardArrowRightOutlined />
                                                            ) : (
                                                                <AdjustOutlined fontSize="inherit" />
                                                            )
                                                        ) : (
                                                            ''
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
                                                    cat.parent?.slug ===
                                                    selectedMenu[1]
                                            )
                                            .map((cat) => (
                                                <li
                                                    key={cat.slug}
                                                    data-menu={cat.slug}
                                                >
                                                    <Link
                                                        to={`/products/${cat.slug}/1`}
                                                        component={RouterLink}
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
                                                        <AdjustOutlined fontSize="inherit" />
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
                                        .filter((cat) => !cat.parent)
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
                                                                    catsub
                                                                        .parent
                                                                        ?.slug ===
                                                                    cat.slug
                                                            )
                                                            .map((catsub) => (
                                                                <li
                                                                    key={
                                                                        catsub.slug
                                                                    }
                                                                >
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
                    <Link component={RouterLink} to="/" underline="none">
                        Bazaar
                    </Link>
                </Logo>
                <Nav
                    style={{
                        justifyContent: 'flex-end',
                    }}
                >
                    <NavList
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <NavListItem style={{ padding: '16px 0' }}>
                            <IconButton style={{ cursor: 'pointer' }}>
                                <SearchSharp fontSize="large" />
                            </IconButton>
                        </NavListItem>
                        <NavListItem style={{ padding: '16px 0' }}>
                            {!user && (
                                <IconButton
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate('/login')}
                                >
                                    <PersonOutlineSharp fontSize="large" />
                                </IconButton>
                            )}
                        </NavListItem>
                        <NavListItem
                            style={{ padding: '16px 0' }}
                            onClick={() => setIsCartDrawerOpen(true)}
                        >
                            <Badge
                                badgeContent={cartItems.reduce(
                                    (acc, currItem) =>
                                        (acc += currItem.quantity),
                                    0
                                )}
                                color="primary"
                            >
                                <IconButton style={{ cursor: 'pointer' }}>
                                    <ShoppingBagOutlined fontSize="large" />
                                </IconButton>
                            </Badge>
                        </NavListItem>
                        <NavListItem>
                            {user && (
                                <StackStyled
                                    flexDirection="row"
                                    alignItems="center"
                                    gap="24px"
                                    sx={{
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: '32px',
                                            height: '32px',
                                        }}
                                    >
                                        {user?.photo?.url && (
                                            <img
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                }}
                                                crossOrigin="anonymous"
                                                src={user.photo?.url}
                                                alt={user.photo?.title}
                                            />
                                        )}
                                    </Avatar>
                                    <ExpandMoreOutlined />
                                    <nav
                                        style={{
                                            minWidth: '180px',
                                        }}
                                    >
                                        <List>
                                            <ListItem disablePadding>
                                                {user?.role === 'admin' && (
                                                    <ListItemButton
                                                        onClick={() =>
                                                            navigate(
                                                                '/dashboard'
                                                            )
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <Dashboard />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Dashboard" />
                                                    </ListItemButton>
                                                )}
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={() =>
                                                        navigate(
                                                            user?.role ===
                                                                'admin'
                                                                ? '/dashboard/profile'
                                                                : '/profile'
                                                        )
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <PersonOutlineSharp />
                                                    </ListItemIcon>
                                                    <ListItemText primary="My Profile" />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                        <Divider />
                                        <List>
                                            <ListItem
                                                sx={{ textAlign: 'center' }}
                                                disablePadding
                                            >
                                                <ListItemButton
                                                    onClick={clickLogoutHandler}
                                                    sx={{ textAlign: 'center' }}
                                                >
                                                    <ListItemText primary="Logout" />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </nav>
                                </StackStyled>
                            )}
                        </NavListItem>
                    </NavList>
                    <Drawer
                        anchor="right"
                        open={isCartDrawerOpen}
                        onClose={() => setIsCartDrawerOpen(false)}
                    >
                        <DrawerCart>
                            <DrawerCartHeader>
                                <Typography variant="h5" fontWeight="bold">
                                    Cart (
                                    {cartItems.reduce(
                                        (acc, currItem) =>
                                            (acc += currItem.quantity),
                                        0
                                    )}
                                    )
                                </Typography>
                                <div>
                                    <IconButton
                                        onClick={() =>
                                            setIsCartDrawerOpen(false)
                                        }
                                        color="primary"
                                    >
                                        <CloseOutlined fontSize="small" />
                                    </IconButton>
                                </div>
                            </DrawerCartHeader>
                            <DrawerCartBody>
                                {cartItems.map((item, i) => (
                                    <Card key={i} sx={{ display: 'flex' }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 150, height: 180 }}
                                            image={item.image}
                                        />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    flex: '1 0 auto',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px',
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="bold"
                                                >
                                                    {item.title}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                >
                                                    $
                                                    {item.price * item.quantity}
                                                </Typography>
                                                <Box>
                                                    {item.variations.map(
                                                        (variation, i) => (
                                                            <Box
                                                                key={i}
                                                                sx={{
                                                                    display:
                                                                        'flex',
                                                                    gap: '8px',
                                                                }}
                                                            >
                                                                <Typography variant="subtitle2">
                                                                    {
                                                                        variation.name
                                                                    }
                                                                    :
                                                                </Typography>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    fontWeight={
                                                                        'bold'
                                                                    }
                                                                >
                                                                    {
                                                                        variation.value
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )
                                                    )}
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                        }}
                                                    >
                                                        <Button
                                                            onClick={
                                                                quantityInputfieldHandler
                                                            }
                                                            data-id={item.id}
                                                            data-type={'INC'}
                                                            sx={{
                                                                padding: 0,
                                                                minWidth:
                                                                    'max-content',
                                                            }}
                                                            size="small"
                                                        >
                                                            <AddOutlined fontSize="small" />
                                                        </Button>
                                                        <TextFieldQuantity
                                                            onChange={
                                                                onQuantityChangeHandler
                                                            }
                                                            onBlur={
                                                                onQuantityBlurHandler
                                                            }
                                                            data-id={item.id}
                                                            value={
                                                                quantityInputsDefaultValues.find(
                                                                    (qItem) =>
                                                                        qItem.id ===
                                                                        item.id
                                                                )?.value
                                                            }
                                                            variant="outlined"
                                                        />
                                                        <Button
                                                            onClick={
                                                                quantityInputfieldHandler
                                                            }
                                                            data-id={item.id}
                                                            data-type={'DEC'}
                                                            sx={{
                                                                padding: 0,
                                                                minWidth:
                                                                    'max-content',
                                                            }}
                                                            size="small"
                                                        >
                                                            <RemoveOutlined fontSize="small" />
                                                        </Button>
                                                    </Box>
                                                    <IconButton
                                                        onClick={
                                                            removeItemFromCartHandler
                                                        }
                                                        data-id={item.id}
                                                    >
                                                        <DeleteOutline />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Box>
                                    </Card>
                                ))}
                            </DrawerCartBody>
                            <DrawerCartFooter>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '24px 0',
                                    }}
                                >
                                    <Typography variant="h5" fontWeight="bold">
                                        Subtotal
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        $
                                        {cartItems
                                            .reduce(
                                                (acc, currItem) =>
                                                    (acc +=
                                                        currItem.price *
                                                        currItem.quantity),
                                                0
                                            )
                                            .toFixed(2)}
                                    </Typography>
                                </Box>
                                <Button
                                    fullWidth={true}
                                    variant="contained"
                                    style={{ borderRadius: '0' }}
                                    size="large"
                                    endIcon={<ArrowForward />}
                                >
                                    View My Cart
                                </Button>
                            </DrawerCartFooter>
                        </DrawerCart>
                    </Drawer>
                </Nav>
            </NavBar>
        </HeaderStyled>
    )
}

export default Header
