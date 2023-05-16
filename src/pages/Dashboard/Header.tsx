import {
    ExpandMore,
    ExpandMoreOutlined,
    HomeOutlined,
    Menu,
    PersonOutlineSharp,
} from '@mui/icons-material'
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

//Hooks
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { logoutAsync } from '../../store/authReducer'
import { useAppDispatch, useAppSelector } from '../../store/store'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Header Styled
const HeaderStyled = styled.div`
    width: calc(100% - 300px - 32px);
    height: 132px;
    position: fixed;
    top: 0;
    right: 16px;
    z-index: 100;
    border-bottom: 1px solid black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${(props) => props.theme.palette.secondary.main};

    ${(props) => props.theme.breakpoints.down('md')} {
        width: calc(100% - 232px);
        height: 104px;
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
        width: calc(100% - 32px);
    }
`

//Menu Button
const MenuButton = styled.div`
    display: none;

    ${(props) => props.theme.breakpoints.down('sm')} {
        display: block;
    }
`

//Stack Styled
const StackStyled = styled(Stack)`
    & > nav {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1000;
        background: white;
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
const Header = ({
    title,
    subtitle,
    onMenuClick,
}: {
    title: string
    subtitle: string
    onMenuClick: () => void
}) => {
    /**
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //State
    const loggedInUser = useAppSelector((state) => state.auth.data)

    //Redux
    const dispatch = useAppDispatch()

    //Hooks
    const theme = useTheme()
    const navigate = useNavigate()
    const { width } = useWindowDimensions()

    /**
     ** **
     ** ** ** Methods
     ** **
     */
    //Click logout handler
    const clickLogoutHandler = () => {
        dispatch(logoutAsync())
    }

    return (
        <HeaderStyled>
            <MenuButton>
                <IconButton onClick={onMenuClick}>
                    <Menu />
                </IconButton>
            </MenuButton>
            <Box
                sx={{
                    textAlign: 'left',
                    paddingLeft:
                        width <= theme.breakpoints.values.lg ? '0' : '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {subtitle}
                </Typography>
            </Box>
            <StackStyled
                flexDirection="row"
                alignItems="center"
                gap="8px"
                sx={{
                    cursor: 'pointer',
                    position: 'relative',
                }}
            >
                <Avatar sx={{ width: '3.5rem', height: '3.5rem' }}>
                    {loggedInUser?.photo?.url && (
                        <img
                            crossOrigin="anonymous"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                            alt={loggedInUser?.photo?.title}
                            src={loggedInUser?.photo?.url}
                        />
                    )}
                </Avatar>
                {width > theme.breakpoints.values.sm && (
                    <Typography fontWeight="bold" variant="body1">
                        {loggedInUser?.name}
                    </Typography>
                )}
                <ExpandMore />
                <nav
                    style={{
                        minWidth: '180px',
                    }}
                >
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/')}>
                                <ListItemIcon>
                                    <HomeOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigate('/dashboard/profile')}
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
                        <ListItem sx={{ textAlign: 'center' }} disablePadding>
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
        </HeaderStyled>
    )
}

export default Header
