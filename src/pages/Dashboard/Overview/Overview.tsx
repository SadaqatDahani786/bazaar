import { useEffect, useRef, useState } from 'react'

import {
    Box,
    Stack,
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
    PhotoAlbumOutlined,
    ShoppingBasketOutlined,
} from '@mui/icons-material'

import { Chart, ChartConfiguration } from 'chart.js/auto'
import styled from 'styled-components'

//Redux
import { useAppDispatch } from '../../../store/store'
import {
    getTotalRefundsAsync,
    getTotalSalesAsync,
    getTotalSalesInYearAsync,
} from '../../../store/orderReducer'
import { getTotalUsersCountAsync } from '../../../store/userReducer'
import {
    getTopSellingProductsAsync,
    IProduct,
} from '../../../store/productReducer'
import { IMediaDatabase } from '../../../store/mediaReducer'
import {
    getSalesInEachCategoryAsync,
    ICategory,
} from '../../../store/categoryReducer'

//Components
import StatsView from './StatsView'

//Hooks
import useWindowDimensions from '../../../hooks/useWindowDimensions'
import { getGrowthIncrease } from '../../../utils/getGrowthIncrease'

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

//Image Wrapper
const ImageWrapper = styled.div`
    width: 48px;
    height: 48px;
    background: #a7a7a7;
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
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
    //Redux
    const dispatch = useAppDispatch()

    //Stats [total]
    const [totalSales, setTotalSales] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    const [totalRefunds, setTotalRefunds] = useState(0)
    const [totalCustomers, setTotalCustomers] = useState(0)

    //Stats [arrays]
    const [salesInEachCategory, setSalesInEachCategory] = useState<
        {
            sales: number
            orders: number
            category: ICategory
        }[]
    >([])
    const [topSellingProducts, setTopSellingProduct] = useState<
        {
            sold: number
            sales: number
            product: IProduct
            image: IMediaDatabase
        }[]
    >([])
    const [customersInMonthsOfYear, setCustomersInMonthsOfYear] = useState<
        { month: string; users: number }[]
    >([])
    const [refundsInMonthsOfYear, setRefundsInMonthsOfYear] = useState<
        { month: string; refunds: number }[]
    >([])
    const [salesInYear, setTotalSalesInYear] = useState<
        Array<{
            month: string
            sales: number
            orders: number
        }>
    >([])

    //Hooks
    const theme = useTheme()
    const { width } = useWindowDimensions()

    //Refs
    const refRevenueChartCanvas = useRef<HTMLCanvasElement>(null)
    const refSalesCategoryChartCanvas = useRef<HTMLCanvasElement>(null)

    //Colors
    const colors = [
        theme.palette.error.main,
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.success.main,
        theme.palette.primary.main,
        theme.palette.secondary.dark,
    ]

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Set states
    useEffect(() => {
        //1) Fetch total sales
        dispatch(
            getTotalSalesAsync(({ total_sales, total_orders }) => {
                setTotalSales(total_sales)
                setTotalOrders(total_orders)
            })
        )

        //2) Fetch total refunds
        dispatch(
            getTotalRefundsAsync(
                ({ total_refunds, refunds_in_months_of_year }) => {
                    setTotalRefunds(total_refunds)
                    setRefundsInMonthsOfYear(refunds_in_months_of_year)
                }
            )
        )

        //3) Fetch total users
        dispatch(
            getTotalUsersCountAsync(
                ({ total_users, users_in_months_of_year }) => {
                    setTotalCustomers(total_users)
                    setCustomersInMonthsOfYear(users_in_months_of_year)
                }
            )
        )

        //4) Fetch sales in year
        dispatch(
            getTotalSalesInYearAsync({
                year: new Date(Date.now()).getFullYear().toString(),
                cb: (res) => {
                    setTotalSalesInYear(res)
                },
            })
        )

        //5) Fetch top selling products
        dispatch(
            getTopSellingProductsAsync((res) => {
                setTopSellingProduct(res)
            })
        )

        //6) Fetch sales in each category
        dispatch(
            getSalesInEachCategoryAsync((res) => setSalesInEachCategory(res))
        )
    }, [])

    //Chart revenue vs orders
    useEffect(() => {
        //1) Months labels
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

        //2) Data
        const data = {
            labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: labels.map(
                        (label) =>
                            salesInYear.find((sale) => sale.month === label)
                                ?.sales || 0
                    ),
                    fill: false,
                    tension: 0.4,
                },
                {
                    label: 'Order',
                    data: labels.map(
                        (label) =>
                            salesInYear.find((sale) => sale.month === label)
                                ?.orders || 0
                    ),
                    fill: false,
                    tension: 0.4,
                },
            ],
        }

        //3) Config
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

        //4) Validate
        if (
            !refRevenueChartCanvas.current ||
            !(refRevenueChartCanvas.current instanceof HTMLCanvasElement)
        )
            return

        //5) Context
        const context = refRevenueChartCanvas.current.getContext('2d')
        if (!context) return

        //6) Instantiate
        const ChartObj = new Chart(context, config)

        //7) Clean up
        return () => ChartObj.destroy()
    }, [width, salesInYear])

    //Chart sales in categories
    useEffect(() => {
        //1) Labels
        const labels = salesInEachCategory.map((cat) => cat.category.name)

        //2) Dataset
        const data = {
            labels,
            datasets: [
                {
                    label: 'Sales',
                    data: salesInEachCategory.map((cat) => cat.sales),
                    borderWidth: 5,
                    cutout: '80%',
                    backgroundColor: colors,
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
    }, [width, salesInEachCategory])

    return (
        <OverviewStyled>
            <Wrapper>
                <StatsView
                    title="Total Sales"
                    color="primary"
                    icon={
                        <AttachMoneyOutlined fontSize="large" color="primary" />
                    }
                    total={`€${totalSales.toFixed(2)}`}
                    changePercent={{
                        treding:
                            getGrowthIncrease<{ sales: number }>({
                                arr: salesInYear,
                                extracter: ({ sales }) => sales,
                            }).growthPercentage < 0
                                ? 'DOWNWARD'
                                : 'UPWARD',
                        value: getGrowthIncrease<{ sales: number }>({
                            arr: salesInYear,
                            extracter: ({ sales }) => sales,
                        }).growthPercentage,
                    }}
                    changeAmount={`${
                        getGrowthIncrease<{ sales: number }>({
                            arr: salesInYear,
                            extracter: ({ sales }) => sales,
                        }).growth
                    }k this month`}
                />
                <StatsView
                    title="Refunded"
                    icon={
                        <CurrencyExchange fontSize="large" color="secondary" />
                    }
                    total={`€${totalRefunds.toFixed(2)}`}
                    changePercent={{
                        treding:
                            getGrowthIncrease<{ refunds: number }>({
                                arr: refundsInMonthsOfYear,
                                extracter: ({ refunds }) => refunds,
                            }).growthPercentage < 0
                                ? 'DOWNWARD'
                                : 'UPWARD',
                        value: getGrowthIncrease<{ refunds: number }>({
                            arr: refundsInMonthsOfYear,
                            extracter: ({ refunds }) => refunds,
                        }).growthPercentage,
                    }}
                    changeAmount={`${
                        getGrowthIncrease<{ refunds: number }>({
                            arr: refundsInMonthsOfYear,
                            extracter: ({ refunds }) => refunds,
                        }).growth
                    }k this month`}
                />
                <StatsView
                    title="Total Orders"
                    icon={
                        <ShoppingBasketOutlined
                            fontSize="large"
                            color="secondary"
                        />
                    }
                    total={totalOrders.toString()}
                    changePercent={{
                        treding:
                            getGrowthIncrease<{ orders: number }>({
                                arr: salesInYear,
                                extracter: ({ orders }) => orders,
                            }).growthPercentage < 0
                                ? 'DOWNWARD'
                                : 'UPWARD',
                        value: getGrowthIncrease<{ orders: number }>({
                            arr: salesInYear,
                            extracter: ({ orders }) => orders,
                        }).growthPercentage,
                    }}
                    changeAmount={`${Math.abs(
                        getGrowthIncrease<{ orders: number }>({
                            arr: salesInYear,
                            extracter: ({ orders }) => orders,
                        }).growth
                    )}k this month`}
                />
                <StatsView
                    title="Total Customers"
                    icon={<PersonOutline fontSize="large" color="secondary" />}
                    total={totalCustomers.toString()}
                    changePercent={{
                        treding:
                            getGrowthIncrease<{ users: number }>({
                                arr: customersInMonthsOfYear,
                                extracter: ({ users }) => users,
                            }).growthPercentage < 0
                                ? 'DOWNWARD'
                                : 'UPWARD',
                        value: getGrowthIncrease<{ users: number }>({
                            arr: customersInMonthsOfYear,
                            extracter: ({ users }) => users,
                        }).growthPercentage,
                    }}
                    changeAmount={`${
                        getGrowthIncrease<{ users: number }>({
                            arr: customersInMonthsOfYear,
                            extracter: ({ users }) => users,
                        }).growth
                    }k this month`}
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
                                {topSellingProducts.map((prod) => (
                                    <TableRow
                                        key={prod.product._id}
                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Stack
                                                flexDirection="row"
                                                alignItems="center"
                                                gap="16px"
                                            >
                                                <ImageWrapper>
                                                    {prod.image?.url ? (
                                                        <img
                                                            src={
                                                                prod.image?.url
                                                            }
                                                            alt={
                                                                prod.image.title
                                                            }
                                                            crossOrigin="anonymous"
                                                        />
                                                    ) : (
                                                        <PhotoAlbumOutlined
                                                            fontSize="large"
                                                            color="secondary"
                                                        />
                                                    )}
                                                </ImageWrapper>
                                                {prod.product.title}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            {prod.product._id}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack>
                                                <Typography variant="subtitle2">
                                                    &euro;
                                                    {(
                                                        prod.product
                                                            .selling_price ||
                                                        prod.product.price
                                                    ).toFixed(2)}
                                                </Typography>
                                                {prod.product.selling_price && (
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="caption"
                                                        sx={{
                                                            textDecoration:
                                                                'line-through',
                                                        }}
                                                    >
                                                        &euro;
                                                        {prod.product.price.toFixed(
                                                            2
                                                        )}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            {prod.sold}
                                        </TableCell>
                                        <TableCell align="right">
                                            &euro;{prod.sales.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Widget>
                </WidgetsInner>
                <WidgetsInner>
                    <Widget>
                        <Box sx={{ position: 'relative' }}>
                            <ChartStyled ref={refSalesCategoryChartCanvas} />
                            <DoughnutCenterText variant="h6" fontWeight="bold">
                                &euro;
                                {(
                                    salesInEachCategory.reduce(
                                        (acc, currItem) =>
                                            (acc += currItem.sales),
                                        0
                                    ) / 1000
                                ).toFixed(2)}
                                k
                            </DoughnutCenterText>
                        </Box>

                        <Box>
                            {salesInEachCategory.map((cat, i) => (
                                <Row key={cat.category._id}>
                                    <Row>
                                        <ColorCircle
                                            style={{
                                                backgroundColor: colors[i],
                                            }}
                                        />
                                        <Typography variant="subtitle1">
                                            {cat.category.name}
                                        </Typography>
                                    </Row>
                                    <Typography>
                                        &euro;{(cat.sales / 1000).toFixed(2)}k
                                    </Typography>
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
