import React, { useEffect, useState } from 'react'

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
    Button,
    Avatar,
    Stack,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CircularProgress,
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
    PhotoAlbumOutlined,
} from '@mui/icons-material'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import { getCurrentUserAsync } from '../../store/userReducer'
import { setUser, logoutAsync } from '../../store/authReducer'
import { getManyCategoryAsync } from '../../store/categoryReducer'
import {
    addItemInUserCartAsync,
    getUserCartAsync,
    removeItemFromUserCartAsync,
} from '../../store/cartReducer'
import {
    getManyProductAsync,
    getTopSellingProductsAsync,
    IProduct,
} from '../../store/productReducer'
import { openCartDrawer, closeCartDrawer } from '../../store/cartReducer'

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

//Image Wrapper
const ImageWrapper = styled.div`
    width: 150px;
    height: 150px;
    overflow: hidden;
    background: ${(props) => props.theme.palette.grey['300']};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4.2rem;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const user = useAppSelector((state) => state.auth.data)
    const categories = useAppSelector((state) => state.category.data)
    const { data: cart, isLoading } = useAppSelector((state) => state.cart)
    const isCartDrawerOpen = useAppSelector(
        (state) => state.cart.cartDrawerStatus
    )
    const dispatch = useAppDispatch()

    const [isToRemoveAll, setIsToRemoveAll] = useState(false)

    //State
    const [drawerSelectedMenu, setDrawerSelectedMenu] = useState('')
    const [selectedMenu, setSelectedMenu] = useState<string[]>([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    //Products
    const [topProduct, setTopProduct] = useState<IProduct>()
    const [newArrivalProduct, setNewArrivalProduct] = useState<IProduct>()

    //Navigation
    const navigate = useNavigate()

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch categories & set user
    useEffect(() => {
        //1) Fetch categories
        dispatch(getManyCategoryAsync([]))

        //2) Get user id and validate
        const id = localStorage.getItem('user_id')
        if (!id || user) return

        //3) Fetch and set logged in user details
        dispatch(
            getCurrentUserAsync((user) => {
                dispatch(setUser(user))
            })
        )
    }, [])

    //Fetch user cart
    useEffect(() => {
        dispatch(getUserCartAsync(() => ''))

        //1)
        dispatch(
            getTopSellingProductsAsync((products) => {
                if (products && products?.length > 0)
                    setTopProduct({
                        ...products[0].product,
                        image: products[0].image,
                    })
            })
        )

        //2)
        dispatch(
            getManyProductAsync({
                queryParams: [],
                cb: (products) => {
                    if (products && products?.length > 0)
                        setNewArrivalProduct(products[0])
                },
            })
        )
    }, [])

    //Set menu
    useEffect(() => {
        //1) Validate
        if (!categories || categories.length <= 0) return

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

    //Add item in cart handler
    const addItemInCartHandler = (
        product: IProduct,
        quantity: number,
        variants: { name: string; term: string }[]
    ) => {
        //1) Validate
        if (!product || !quantity) return

        //2) Create form data
        const data = {
            product: product._id,
            quantity: quantity,
            selected_variants:
                variants.map((variant) => ({
                    name: variant.name,
                    term: variant.term,
                })) || [],
        }

        //3) Dispatch action to add item into the cart
        dispatch(addItemInUserCartAsync({ data, cb: () => undefined }))
    }

    //Remove item from cart handler
    const removeItemFromCartHandler = (
        product: IProduct,
        quantity: number,
        variants: { name: string; term: string }[]
    ) => {
        //1) Validate
        if (!product || !quantity) return

        //2) Create form data
        const data = {
            product: product._id,
            quantity: quantity,
            selected_variants:
                variants.map((variant) => ({
                    name: variant.name,
                    term: variant.term,
                })) || [],
        }

        //3) Dispatch action to remove item from the cart
        dispatch(removeItemFromUserCartAsync({ data, cb: () => undefined }))
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
                        <Typography color="secondary" variant="subtitle2">
                            HURRY UP! SAVE BIG WITH ON GOING SALE UPTO 50% OFF
                        </Typography>
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
                                    <Link
                                        component={RouterLink}
                                        to={`/product/${topProduct?._id}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <CardStyled variant="elevation">
                                            <ImageWrapper
                                                style={{
                                                    width: '16rem',
                                                    height: '100%',
                                                }}
                                            >
                                                {topProduct?.image?.url ? (
                                                    <img
                                                        src={
                                                            topProduct?.image
                                                                ?.url
                                                        }
                                                        alt={
                                                            topProduct?.image
                                                                ?.title
                                                        }
                                                    />
                                                ) : (
                                                    <PhotoAlbumOutlined
                                                        color="secondary"
                                                        fontSize="inherit"
                                                    />
                                                )}
                                            </ImageWrapper>
                                            <CardDetails>
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="bold"
                                                    fontFamily="Playfair Display"
                                                    color="secondary"
                                                >
                                                    {topProduct?.title}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="secondary"
                                                >
                                                    Top Product
                                                </Typography>
                                            </CardDetails>
                                        </CardStyled>
                                    </Link>
                                </NavCol>
                                <NavCol>
                                    <Link
                                        component={RouterLink}
                                        to={`/product/${newArrivalProduct?._id}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <CardStyled variant="elevation">
                                            <ImageWrapper
                                                style={{
                                                    width: '16rem',
                                                    height: '100%',
                                                }}
                                            >
                                                {newArrivalProduct?.image
                                                    ?.url ? (
                                                    <img
                                                        src={
                                                            newArrivalProduct
                                                                ?.image?.url
                                                        }
                                                        alt={
                                                            newArrivalProduct
                                                                ?.image?.title
                                                        }
                                                    />
                                                ) : (
                                                    <PhotoAlbumOutlined
                                                        color="secondary"
                                                        fontSize="inherit"
                                                    />
                                                )}
                                            </ImageWrapper>
                                            <CardDetails>
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="bold"
                                                    fontFamily="Playfair Display"
                                                    color="secondary"
                                                >
                                                    {newArrivalProduct?.title}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="secondary"
                                                >
                                                    New Arrival
                                                </Typography>
                                            </CardDetails>
                                        </CardStyled>
                                    </Link>
                                </NavCol>
                            </NavSubMenu>
                        </NavListItem>
                        <NavListItem>
                            <Link
                                component={RouterLink}
                                to="/about-us"
                                underline="none"
                                color="primary"
                                sx={{ ':hover': { color: 'text.secondary' } }}
                            >
                                About Us
                            </Link>
                        </NavListItem>
                        <NavListItem>
                            <Link
                                component={RouterLink}
                                to="/contact"
                                underline="none"
                                color="primary"
                                sx={{ ':hover': { color: 'text.secondary' } }}
                            >
                                Contact
                            </Link>
                        </NavListItem>
                    </NavList>
                    <MenuButton onClick={() => setIsDrawerOpen(false)}>
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
                            <IconButton
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/search')}
                            >
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
                            onClick={() => dispatch(openCartDrawer())}
                        >
                            <Badge
                                badgeContent={cart?.products.reduce(
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
                        onClose={() => dispatch(closeCartDrawer())}
                    >
                        <DrawerCart>
                            <DrawerCartHeader>
                                <Typography variant="h5" fontWeight="bold">
                                    Cart (
                                    {cart?.products.reduce(
                                        (acc, currItem) =>
                                            (acc += currItem.quantity),
                                        0
                                    ) || 0}
                                    )
                                </Typography>
                                <div>
                                    <IconButton
                                        onClick={() =>
                                            dispatch(closeCartDrawer())
                                        }
                                        color="primary"
                                    >
                                        <CloseOutlined fontSize="small" />
                                    </IconButton>
                                </div>
                            </DrawerCartHeader>
                            <DrawerCartBody>
                                {!user ? (
                                    <Typography>
                                        Login or create an account to add
                                        products into your cart.
                                    </Typography>
                                ) : (
                                    cart?.products.map((item) => (
                                        <Card
                                            key={item.product._id}
                                            sx={{ display: 'flex' }}
                                        >
                                            <ImageWrapper>
                                                {item?.product?.image?.url ? (
                                                    <img
                                                        crossOrigin="anonymous"
                                                        src={
                                                            item.product?.image
                                                                ?.url
                                                        }
                                                    />
                                                ) : (
                                                    <PhotoAlbumOutlined
                                                        fontSize="inherit"
                                                        color="secondary"
                                                    />
                                                )}
                                            </ImageWrapper>
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
                                                        {item.product.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        color="text.secondary"
                                                    >
                                                        &euro;
                                                        {(
                                                            (item.product
                                                                .selling_price ||
                                                                item.product
                                                                    .price) *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </Typography>
                                                    <Box>
                                                        {item.selected_variants.map(
                                                            (variant) => (
                                                                <Box
                                                                    key={
                                                                        variant.term
                                                                    }
                                                                    sx={{
                                                                        display:
                                                                            'flex',
                                                                        gap: '8px',
                                                                    }}
                                                                >
                                                                    <Typography variant="subtitle2">
                                                                        {
                                                                            variant.name
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
                                                                            variant.term
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
                                                                disabled={
                                                                    isLoading.add_item
                                                                }
                                                                onClick={() =>
                                                                    addItemInCartHandler(
                                                                        item.product,
                                                                        1,
                                                                        item.selected_variants
                                                                    )
                                                                }
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
                                                                disabled
                                                                value={
                                                                    item.quantity
                                                                }
                                                                variant="outlined"
                                                            />
                                                            <Button
                                                                disabled={
                                                                    isLoading.remove_item
                                                                }
                                                                onClick={() => {
                                                                    setIsToRemoveAll(
                                                                        false
                                                                    )
                                                                    removeItemFromCartHandler(
                                                                        item.product,
                                                                        1,
                                                                        item.selected_variants
                                                                    )
                                                                }}
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
                                                            disabled={
                                                                isLoading.remove_item &&
                                                                isToRemoveAll
                                                            }
                                                        >
                                                            {isLoading.remove_item &&
                                                            isToRemoveAll ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                <DeleteOutline
                                                                    onClick={() => {
                                                                        setIsToRemoveAll(
                                                                            true
                                                                        )
                                                                        removeItemFromCartHandler(
                                                                            item.product,
                                                                            item.quantity,
                                                                            item.selected_variants
                                                                        )
                                                                    }}
                                                                />
                                                            )}
                                                        </IconButton>
                                                    </Box>
                                                </CardContent>
                                            </Box>
                                        </Card>
                                    ))
                                )}
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
                                        &euro;
                                        {(
                                            cart?.products.reduce(
                                                (acc, currItem) =>
                                                    (acc +=
                                                        (currItem.product
                                                            .selling_price ||
                                                            currItem.product
                                                                .price) *
                                                        currItem.quantity),
                                                0
                                            ) || 0
                                        ).toFixed(2)}
                                    </Typography>
                                </Box>
                                <Button
                                    fullWidth={true}
                                    variant="contained"
                                    style={{ borderRadius: '0' }}
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    disabled={
                                        !(cart && cart.products.length > 0)
                                    }
                                    onClick={() => {
                                        dispatch(closeCartDrawer())
                                        navigate('/cart')
                                    }}
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
