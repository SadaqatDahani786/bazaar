import { AddOutlined, TrendingDown, TrendingUp } from '@mui/icons-material'
import { Typography, useTheme } from '@mui/material'

import styled from 'styled-components'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Stats View
const StatsViewStyled = styled.div`
    flex: 1;
    height: 232px;
    padding: 16px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border: 1px solid black;

    &:not(:last-child) {
        ${(props) => props.theme.breakpoints.up('lg')} {
            border-right: 0;
        }
    }

    ${(props) => props.theme.breakpoints.down('lg')} {
        flex: 0 0 calc(100% / 2);
        &:nth-child(1) {
            border-right: 0;
            border-bottom: 0;
        }

        &:nth-child(2) {
            border-bottom: 0;
        }

        &:nth-child(3) {
            border-right: 0;
        }
    }

    ${(props) => props.theme.breakpoints.down('md')} {
        flex: 0 0 100%;

        &:nth-child(3) {
            border-right: 1px solid black;
            border-bottom: 0;
        }
    }
`

//Icon Rounded Box
const IconRoundedBox = styled.div`
    width: 48px;
    height: 48px;
    background: black;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

//Row
const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
`

/**
 ** ======================================================
 ** Interface [IStatsViewProps]
 ** ======================================================
 */
interface IStatsViewProps {
    color?: 'primary' | 'secondary'
    icon: React.ReactNode
    title: string
    total: string
    changePercent: {
        treding: 'UPWARD' | 'DOWNWARD'
        value: number
    }
    changeAmount: string
}

/**
 ** ======================================================
 ** Component [StatsView]
 ** ======================================================
 */
const StatsView = ({
    color = 'secondary',
    title,
    total,
    icon,
    changePercent,
    changeAmount,
}: IStatsViewProps) => {
    const theme = useTheme()

    return (
        <StatsViewStyled
            style={{
                backgroundColor:
                    color === 'primary'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
            }}
        >
            <Row
                style={{
                    marginBottom: 'auto',
                }}
            >
                <IconRoundedBox
                    style={{
                        background:
                            color === 'primary'
                                ? theme.palette.secondary.main
                                : theme.palette.primary.main,
                    }}
                >
                    {icon}
                </IconRoundedBox>
                <Typography
                    variant="subtitle1"
                    color={color === 'primary' ? 'secondary' : 'primary'}
                >
                    {title}
                </Typography>
            </Row>
            <Typography
                color={color === 'primary' ? 'secondary' : 'primary'}
                fontWeight="bold"
                variant="h4"
            >
                {total}
            </Typography>
            <Row>
                <Row
                    style={{
                        gap: '0px',
                        color:
                            changePercent.treding === 'UPWARD'
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                    }}
                >
                    {changePercent.treding === 'UPWARD' ? (
                        <TrendingUp fontSize="small" />
                    ) : (
                        <TrendingDown fontSize="small" />
                    )}
                    <Typography>{changePercent.value}%</Typography>
                </Row>
                <Row
                    style={{
                        gap: '0px',
                        color:
                            color === 'primary'
                                ? theme.palette.secondary.main
                                : theme.palette.primary.main,
                    }}
                >
                    {changePercent.treding === 'UPWARD' && (
                        <AddOutlined fontSize="small" />
                    )}

                    <Typography>{changeAmount}</Typography>
                </Row>
            </Row>
        </StatsViewStyled>
    )
}

export default StatsView
