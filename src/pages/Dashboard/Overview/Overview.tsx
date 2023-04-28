import { useEffect, useRef } from 'react'

import {
    Box,
    CardMedia,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material'
import {
    AttachMoneyOutlined,
    CurrencyExchange,
    PersonOutline,
    ShoppingBasketOutlined,
} from '@mui/icons-material'

import { Chart, ChartConfiguration } from 'chart.js/auto'
import styled from 'styled-components'

//Components
import StatsView from './StatsView'

//Hooks
import useWindowDimensions from '../../../hooks/useWindowDimensions'

/*
 ** **
 ** ** ** Overview Styled
 ** **
 */

//Overview
const OverviewStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 80px;
    padding: 80px 0;

    ${(props) => props.theme.breakpoints.down('md')} {
        padding: 0;
        padding-bottom: 24px;
        gap: 16px;
    }
`

//Wrapper
const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`

//Widget Wraper
const WidgetsWrapper = styled.div`
    display: flex;
    gap: 16px;
    height: 600px;

    ${(props) => props.theme.breakpoints.down('lg')} {
        height: max-content;
        flex-direction: column;
    }
`

//Widget Inner
const WidgetsInner = styled.div`
    flex: 3;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &:nth-child(2) {
        flex: 1;
    }
`

//Widget
const Widget = styled.div`
    overflow-y: scroll;
    display: flex;
    width: 100%;
    height: 100%;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    padding: 16px;
    position: relative;

    &:nth-child(1) {
        ${(props) => props.theme.breakpoints.down('lg')} {
            flex-direction: row;
            align-items: center;
        }

        ${(props) => props.theme.breakpoints.down('md')} {
            flex-direction: column;
            align-items: center;
        }
    }
`

//Chart Canvas
const ChartStyled = styled.canvas``

//Doughnut Center Text
const DoughnutCenterText = styled(Typography)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

//Row
const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    &:not(& > div) {
        padding: 8px 0;
        &:not(:last-child) {
            border-bottom: 1px solid
                ${(props) => props.theme.palette.grey['300']};
        }
    }
`

//Colro Circle
const ColorCircle = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 100%;
`

/**
 ** ======================================================
 ** Component [Overview]
 ** ======================================================
 */
const Overview = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const refRevenueChartCanvas = useRef<HTMLCanvasElement>(null)
    const refSalesCategoryChartCanvas = useRef<HTMLCanvasElement>(null)

    const theme = useTheme()
    const { width } = useWindowDimensions()

    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Sales in category
    const salesInCategories = [
        {
            title: 'Fashion',
            color: theme.palette.error.main,
            sales: 135.5,
        },
        {
            title: 'Electronics',
            color: theme.palette.info.main,
            sales: 115.44,
        },
        {
            title: 'Health & Beauty',
            color: theme.palette.warning.main,
            sales: 95.12,
        },
        {
            title: 'Fragrances',
            color: theme.palette.success.main,
            sales: 65.53,
        },
        {
            title: 'Gaming',
            color: theme.palette.primary.main,
            sales: 45.56,
        },
        {
            title: 'Home & Decoration',
            color: theme.palette.secondary.dark,
            sales: 10.94,
        },
    ]

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Chart revenue vs orders
    useEffect(() => {
        const labels = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]

        const data = {
            labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: [65, 59, 80, 81, 56, 55, 40, 55, 10, 24, 45, 56],
                    fill: false,
                    tension: 0.4,
                },
                {
                    label: 'Order',
                    data: [55, 79, 10, 41, 56, 25, 10, 12, 65, 34, 65, 34],
                    fill: false,
                    tension: 0.4,
                },
            ],
        }
        const config: ChartConfiguration = {
            type: 'line',
            data,
            options: {
                plugins: {
                    legend: {
                        labels: {
                            boxWidth: 16,
                            boxHeight: 16,
                            useBorderRadius: true,
                            borderRadius: 8,
                        },
                        align: 'end',
                    },
                },
                responsive: true,
                aspectRatio: 3,
                maintainAspectRatio: true,
            },
        }

        if (
            !refRevenueChartCanvas.current ||
            !(refRevenueChartCanvas.current instanceof HTMLCanvasElement)
        )
            return

        const context = refRevenueChartCanvas.current.getContext('2d')

        if (!context) return

        //Instantiate
        const ChartObj = new Chart(context, config)

        return () => ChartObj.destroy()
    }, [width])

    //Chart sales in categories
    useEffect(() => {
        //1) labels
        const labels = salesInCategories.map((cat) => cat.title)

        //2) Dataset
        const data = {
            labels,
            datasets: [
                {
                    label: 'Sales',
                    data: salesInCategories.map((cat) => cat.sales),
                    borderWidth: 5,
                    cutout: '80%',
                    backgroundColor: salesInCategories.map((cat) => cat.color),
                },
            ],
        }

        //3) Config
        const config: ChartConfiguration = {
            type: 'doughnut',
            data,
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                responsive: true,
                aspectRatio: 1,
                maintainAspectRatio: false,
            },
        }

        //4) Validate ref
        if (
            !refSalesCategoryChartCanvas.current ||
            !(refSalesCategoryChartCanvas.current instanceof HTMLCanvasElement)
        ) {
            return
        }

        //5) Validate context
        const context = refSalesCategoryChartCanvas.current.getContext('2d')
        if (!context) return

        //6) Instantiate chart
        const ChartObj = new Chart(context, config)

        //7) Clean up on unmount
        return () => ChartObj.destroy()
    }, [width])

    return (
        <OverviewStyled>
            <Wrapper>
                <StatsView
                    color="primary"
                    title="Total Sales"
                    icon={
                        <AttachMoneyOutlined fontSize="large" color="primary" />
                    }
                    total="$45,645.60"
                    changePercent={{
                        treding: 'UPWARD',
                        value: 2.5,
                    }}
                    changeAmount="4.5k this month"
                />
                <StatsView
                    title="Refunded"
                    icon={
                        <CurrencyExchange fontSize="large" color="secondary" />
                    }
                    total="$11,156.00"
                    changePercent={{
                        treding: 'DOWNWARD',
                        value: 1.5,
                    }}
                    changeAmount="2k this month"
                />
                <StatsView
                    title="Total Orders"
                    icon={
                        <ShoppingBasketOutlined
                            fontSize="large"
                            color="secondary"
                        />
                    }
                    total="4,000"
                    changePercent={{
                        treding: 'UPWARD',
                        value: 6.5,
                    }}
                    changeAmount="2.8k this month"
                />
                <StatsView
                    title="Total Customers"
                    icon={<PersonOutline fontSize="large" color="secondary" />}
                    total="1,400"
                    changePercent={{
                        treding: 'UPWARD',
                        value: 1.7,
                    }}
                    changeAmount="5k this month"
                />
            </Wrapper>
            <WidgetsWrapper>
                <WidgetsInner>
                    <Widget>
                        <Typography variant="h6">Revenue Vs Orders</Typography>
                        <Box sx={{ minWidth: '300px' }}>
                            <ChartStyled ref={refRevenueChartCanvas} />
                        </Box>
                    </Widget>
                    <Widget>
                        <Typography variant="h6">Top Products</Typography>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">
                                        Order ID
                                    </TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Sold</TableCell>
                                    <TableCell align="right">Sales</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CardMedia
                                                sx={{
                                                    width: '48px',
                                                }}
                                                component="img"
                                                image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                                            />
                                            Macbook Air M2
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">#34234</TableCell>
                                    <TableCell align="right">$546.00</TableCell>
                                    <TableCell align="right">467</TableCell>
                                    <TableCell align="right">
                                        $24,445.66
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CardMedia
                                                sx={{
                                                    width: '48px',
                                                }}
                                                component="img"
                                                image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                                            />
                                            Macbook Air M2
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">#34234</TableCell>
                                    <TableCell align="right">$546.00</TableCell>
                                    <TableCell align="right">467</TableCell>
                                    <TableCell align="right">
                                        $24,445.66
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: '8px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CardMedia
                                                sx={{
                                                    width: '48px',
                                                }}
                                                component="img"
                                                image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                                            />
                                            Macbook Air M2
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">#34234</TableCell>
                                    <TableCell align="right">$546.00</TableCell>
                                    <TableCell align="right">467</TableCell>
                                    <TableCell align="right">
                                        $24,445.66
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Widget>
                </WidgetsInner>
                <WidgetsInner>
                    <Widget>
                        <Box sx={{ position: 'relative' }}>
                            <ChartStyled ref={refSalesCategoryChartCanvas} />
                            <DoughnutCenterText variant="h6" fontWeight="bold">
                                $
                                {salesInCategories
                                    .reduce(
                                        (acc, currItem) =>
                                            (acc += currItem.sales),
                                        0
                                    )
                                    .toFixed(2)}
                                k
                            </DoughnutCenterText>
                        </Box>

                        <Box>
                            {salesInCategories.map((cat) => (
                                <Row>
                                    <Row>
                                        <ColorCircle
                                            style={{
                                                backgroundColor: cat.color,
                                            }}
                                        />
                                        <Typography variant="subtitle1">
                                            {cat.title}
                                        </Typography>
                                    </Row>
                                    <Typography>${cat.sales}k</Typography>
                                </Row>
                            ))}
                        </Box>
                    </Widget>
                </WidgetsInner>
            </WidgetsWrapper>
        </OverviewStyled>
    )
}

export default Overview
