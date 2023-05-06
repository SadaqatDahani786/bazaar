import { Typography } from '@mui/material'
import styled from 'styled-components'

/**
 ** ======================================================
 ** Interface [PillProps]
 ** ======================================================
 */
interface PillProps {
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success'
    text?: string
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
}

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Pill
const PillStyled = styled.div<PillProps>`
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${({ color, theme }) =>
        color === 'primary'
            ? theme.palette.primary.dark
            : color === 'secondary'
            ? theme.palette.secondary.dark
            : color === 'error'
            ? theme.palette.error.dark
            : color === 'success'
            ? theme.palette.success.dark
            : theme.palette.info.dark};
    background: ${({ color, theme }) =>
        color === 'primary'
            ? theme.palette.primary.light
            : color === 'secondary'
            ? theme.palette.secondary.light
            : color === 'error'
            ? theme.palette.error.light
            : color === 'success'
            ? theme.palette.success.light
            : theme.palette.info.light};
    padding: 8px 16px;
    border-radius: 4px;
`

/**
 ** ======================================================
 ** Component [Pill]
 ** ======================================================
 */
const Pill = ({ color = 'primary', text, startIcon, endIcon }: PillProps) => {
    return (
        <PillStyled color={color}>
            {startIcon && startIcon}
            <Typography fontWeight="bold" variant="subtitle2" color="inherit">
                {text}
            </Typography>
            {endIcon && endIcon}
        </PillStyled>
    )
}

export default Pill
