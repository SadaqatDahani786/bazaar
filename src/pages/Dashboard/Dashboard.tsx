import { SyntheticEvent, useState } from 'react'

import { Box, Drawer, Link, Typography } from '@mui/material'
import {
    ExpandLess,
    ExpandMore,
    PersonOutline,
    Inventory2Outlined,
    ShoppingBasketOutlined,
    ImageOutlined,
    DashboardOutlined,
    RedeemOutlined,
} from '@mui/icons-material/'

import styled from 'styled-components'

//Components
import Header from './Header'
import Overview from './Overview'
import Media from './Media'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
// DashboardStyled
const DashbaordStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`

//Sidebar
const Sidebar = styled.aside`
    flex: 0 0 300px;
    height: 100%;
    border-right: 1px solid ${(props) => props.theme.palette.primary.main};
    padding: 0 48px;
    position: fixed;
    left: 0;
    top: 0;

    ${(props) => props.theme.breakpoints.down('sm')} {
        display: none;
    }
`

//Sidebar Header
const SidebarHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 24px 0;
    border-bottom: 1px solid black;
`

//Sidebar Nav
const SidebarNav = styled.nav`
    width: 100%;
`

//Nav List
const NavList = styled.ul`
    width: 100%;
    padding: 16px 0px;
`

//Nav Sub List
const NavSubList = styled.ul`
    display: none;
    width: 100%;

    & li {
        padding-left: 40px;
    }

    & a {
        width: 100%;
        font-size: 0.9em;
        padding: 8px 0;
    }
`

//Nav Link
const NavLink = styled(Link)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    font-size: 1.4rem;

    &:hover {
        color: ${(props) => props.theme.palette.primary.light};
    }
`

//Nav List Item
const NavListItem = styled.li`
    width: 100%;
    list-style: none;
`

//Panel Container
const PanelContainer = styled.div`
    width: calc(100% - 332px);
    min-height: calc(100% - 132px);
    margin-top: 132px;
    margin-left: 316px;
    padding-left: 80px;

    ${(props) => props.theme.breakpoints.down('lg')} {
        padding-left: 0;
    }

    ${(props) => props.theme.breakpoints.down('md')} {
        width: calc(100% - 232px);
        margin-left: 216px;
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
        width: calc(100% - 32px);
        margin-left: 16px;
    }
`

/**
 ** ======================================================
 ** Component [Dashboard]
 ** ======================================================
 */
const Dashboard = () => {
    /*
     ** **
     ** ** ** State
     ** **
     */
    const [navLinks, setNavLinks] = useState([
        {
            title: 'Overview',
            sublinks: [],
            isActive: true,
            slug: 'overview',
            icon: <DashboardOutlined />,
        },
        {
            title: 'Product',
            sublinks: [
                {
                    title: 'All Products',
                    isActive: false,
                    slug: 'all-products',
                },
                {
                    title: 'Add New Product',
                    isActive: false,
                    slug: 'add-new-product',
                },
                {
                    title: 'Categories',
                    isActive: false,
                    slug: 'categories',
                },
                {
                    title: 'Reviews',
                    isActive: false,
                    slug: 'reviews',
                },
            ],
            isActive: false,
            slug: 'product',
            icon: <Inventory2Outlined />,
        },
        {
            title: 'Deals',
            sublinks: [
                {
                    title: 'All Deals',
                    isActive: false,
                    slug: 'all-deals',
                },
                {
                    title: 'Add New Deal',
                    isActive: false,
                    slug: 'add-new-deal',
                },
            ],
            isActive: false,
            slug: 'deal',
            icon: <RedeemOutlined />,
        },
        {
            title: 'Customer',
            sublinks: [
                {
                    title: 'All Customers',
                    isActive: false,
                    slug: 'all-products',
                },
                {
                    title: 'Add New Customer',
                    isActive: false,
                    slug: 'add-new-customer',
                },
                {
                    title: 'Profile',
                    isActive: false,
                    slug: 'profile',
                },
            ],
            isActive: false,
            slug: 'customer',
            icon: <PersonOutline />,
        },
        {
            title: 'Order',
            sublinks: [
                {
                    title: 'All Orders',
                    isActive: false,
                    slug: 'all-orders',
                },
                {
                    title: 'Add New Order',
                    isActive: false,
                    slug: 'add-new-order',
                },
            ],
            isActive: false,
            slug: 'order',
            icon: <ShoppingBasketOutlined />,
        },
        {
            title: 'Media',
            sublinks: [
                {
                    title: 'Library',
                    isActive: false,
                    slug: 'library',
                },
                {
                    title: 'Add New Media',
                    isActive: false,
                    slug: 'add-new-media',
                },
            ],
            isActive: false,
            slug: 'media',
            icon: <ImageOutlined />,
        },
    ])
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Clink Link Handler
    const clickHandler = (e: SyntheticEvent<HTMLLIElement>) => {
        const slug = e.currentTarget.dataset.slug

        if (!slug) return

        const updatedState = navLinks.map((item) => {
            const isInSubLink = item.sublinks.some(
                (subitem) => subitem.slug === slug
            )

            //1) Check itself
            if (item.slug === slug)
                return {
                    ...item,
                    isActive: true,
                    sublinks: item.sublinks.map((subItem, i) => ({
                        ...subItem,
                        isActive: i === 0,
                    })),
                }

            //2) Check if in chlidlren
            if (isInSubLink)
                return {
                    ...item,
                    sublinks: item.sublinks.map((subItem) => ({
                        ...subItem,
                        isActive: subItem.slug === slug,
                    })),
                }

            //3) Neither children nor itself
            return {
                ...item,
                isActive: false,
                sublinks: item.sublinks.map((subItem) => ({
                    ...subItem,
                    isActive: false,
                })),
            }
        })

        setNavLinks(updatedState)
    }

    //Click Menu Button Handler
    const onClickMenuHandler = () => {
        setIsSideMenuOpen(true)
    }

    return (
        <DashbaordStyled>
            <Header onMenuClick={onClickMenuHandler} />
            <Sidebar>
                <SidebarHeader>
                    <Typography fontFamily="Playfair Display" variant="h6">
                        Bazaar's
                    </Typography>
                    <Typography variant="h4">Dashboard</Typography>
                </SidebarHeader>
                <SidebarNav>
                    <NavList>
                        {navLinks.map((item) => (
                            <Box key={item.slug}>
                                <NavListItem
                                    data-slug={item.slug}
                                    onClick={clickHandler}
                                >
                                    <NavLink
                                        underline="none"
                                        style={{
                                            fontWeight: item.isActive
                                                ? 'normal'
                                                : 300,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: '16px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {item.icon && item.icon}
                                            {item.title}
                                        </Box>
                                        {item.sublinks.length > 0 ? (
                                            item.isActive ? (
                                                <ExpandLess />
                                            ) : (
                                                <ExpandMore />
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </NavLink>
                                </NavListItem>
                                {item.sublinks.length > 0 && (
                                    <NavSubList
                                        style={{
                                            display: item.isActive
                                                ? 'block'
                                                : 'none',
                                        }}
                                    >
                                        {item.sublinks.map((subItem) => (
                                            <NavListItem
                                                key={subItem.slug}
                                                data-slug={subItem.slug}
                                                onClick={clickHandler}
                                            >
                                                <NavLink
                                                    underline="none"
                                                    style={{
                                                        fontWeight:
                                                            subItem.isActive
                                                                ? 'normal'
                                                                : 300,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            gap: '16px',
                                                            alignItems:
                                                                'center',
                                                        }}
                                                    >
                                                        {subItem.title}
                                                    </Box>
                                                </NavLink>
                                            </NavListItem>
                                        ))}
                                    </NavSubList>
                                )}
                            </Box>
                        ))}
                    </NavList>
                </SidebarNav>
            </Sidebar>
            <Drawer
                sx={{ fontFamily: 'Lato' }}
                open={isSideMenuOpen}
                onClose={() => setIsSideMenuOpen(false)}
            >
                <Box
                    sx={{
                        padding: '24px',
                        width: '300px',
                        height: '100%',
                        background: 'white',
                    }}
                >
                    <SidebarHeader>
                        <Typography fontFamily="Playfair Display" variant="h6">
                            Bazaar's
                        </Typography>
                        <Typography variant="h4">Dashboard</Typography>
                    </SidebarHeader>
                    <SidebarNav>
                        <NavList>
                            {navLinks.map((item) => (
                                <Box key={item.slug}>
                                    <NavListItem
                                        data-slug={item.slug}
                                        onClick={clickHandler}
                                    >
                                        <NavLink
                                            underline="none"
                                            style={{
                                                cursor: 'pointer',
                                                fontWeight: item.isActive
                                                    ? 'bold'
                                                    : 300,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: '16px',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {item.icon && item.icon}
                                                {item.title}
                                            </Box>
                                            {item.sublinks.length > 0 ? (
                                                item.isActive ? (
                                                    <ExpandLess />
                                                ) : (
                                                    <ExpandMore />
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </NavLink>
                                    </NavListItem>
                                    {item.sublinks.length > 0 && (
                                        <NavSubList
                                            style={{
                                                display: item.isActive
                                                    ? 'block'
                                                    : 'none',
                                            }}
                                        >
                                            {item.sublinks.map((subItem) => (
                                                <NavListItem
                                                    key={subItem.slug}
                                                    data-slug={subItem.slug}
                                                    onClick={clickHandler}
                                                >
                                                    <NavLink
                                                        underline="none"
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontWeight:
                                                                subItem.isActive
                                                                    ? 'bold'
                                                                    : 300,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                gap: '16px',
                                                                alignItems:
                                                                    'center',
                                                            }}
                                                        >
                                                            {subItem.title}
                                                        </Box>
                                                    </NavLink>
                                                </NavListItem>
                                            ))}
                                        </NavSubList>
                                    )}
                                </Box>
                            ))}
                        </NavList>
                    </SidebarNav>
                </Box>
            </Drawer>
            <PanelContainer>
                {/* <Overview /> */}
                <Media />
            </PanelContainer>
        </DashbaordStyled>
    )
}

export default Dashboard
