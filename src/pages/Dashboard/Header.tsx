import { ExpandMore, Menu } from '@mui/icons-material'
import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material'

import styled from 'styled-components'

//Hooks
import useWindowDimensions from '../../hooks/useWindowDimensions'

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
     ** ** ** Hooks
     ** **
     */
    const theme = useTheme()
    const { width } = useWindowDimensions()

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar
                    sx={{ width: '3.5rem', height: '3.5rem' }}
                    alt="Sadaqat Dahani"
                    src="https://pbs.twimg.com/profile_images/1386009845829099528/8edFUtNp_400x400.jpg"
                />
                {width > theme.breakpoints.values.sm && (
                    <Typography fontWeight="bold" variant="body1">
                        Sadaqat Dahani
                    </Typography>
                )}
                <ExpandMore />
            </Box>
        </HeaderStyled>
    )
}

export default Header
