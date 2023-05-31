import { useEffect, useState } from 'react'

import { DeleteOutline } from '@mui/icons-material'
import {
    Stack,
    TextField,
    Button,
    CircularProgress,
    Alert,
    AlertTitle,
    ButtonGroup,
    Checkbox,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    MenuItem,
    TableFooter,
    TablePagination,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import {
    deleteOrderAsync,
    editSelectedStatus,
    getManyOrderAsync,
    IOrder,
} from '../../../../store/orderReducer'

//Components
import Pill from '../../../../components/Pill'

//Hooks & Func
import { toCapitalize } from '../../../../utils/toCapitalize'
import { useNavigate } from 'react-router-dom'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//All Orders
const AllOrdersStyled = styled.div`
    padding: 32px 0;
`

//Control Bar
const ControlBar = styled.div`
    width: 100%;
    height: 80px;
    background: ${(props) => props.theme.palette.grey['300']};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    padding: 0 16px;
`

//Widget
const Widget = styled.div`
    width: 100%;
    min-height: 400px;
    border: 1px solid black;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
`

/**
 ** ======================================================
 ** Component [AllOrders]
 ** ======================================================
 */
const AllOrders = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const {
        isLoading,
        errors,
        data: orders,
        count,
    } = useAppSelector((state) => state.order)
    const dispatch = useAppDispatch()

    //State
    const [showAlert, setShowAlert] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<IOrder>()
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('all')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    //Nav
    const navigate = useNavigate()

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    useEffect(() => {
        dispatch(
            getManyOrderAsync({
                opts: {
                    filters: [
                        {
                            name: 'delivery_status',
                            value:
                                selectedDeliveryStatus === 'all'
                                    ? ''
                                    : selectedDeliveryStatus,
                        },
                        {
                            name: 'page',
                            value: page.toString(),
                        },
                        {
                            name: 'limit',
                            value: rowsPerPage.toString(),
                        },
                    ],
                },
            })
        )
    }, [selectedDeliveryStatus, page, rowsPerPage])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click selete all handler
    const clickSelectAllHandler = () => {
        //1) Determine state
        const state = orders.every((order) => !order.isSelected)

        //2) Dispatch action
        dispatch(
            editSelectedStatus({
                ids: orders.map((order) => order._id),
                edit: state,
            })
        )
    }

    //Click select handler
    const clickSelectHandler = (id: string) => {
        dispatch(
            editSelectedStatus({
                ids: [id],
            })
        )
    }

    //Click delete handler
    const clickDeleteHandler = () => {
        //1) Get ids of selected orders
        const ids = orders
            .filter((order) => order.isSelected)
            .map((order) => order._id)

        //2) Dispatch action to delete orders
        dispatch(deleteOrderAsync({ ids, cb: () => '' }))
    }

    return (
        <AllOrdersStyled>
            <Stack gap="80px">
                <ControlBar>
                    <Stack
                        width="100%"
                        flexDirection="row"
                        justifyContent="space-between"
                    >
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap="8px"
                        >
                            <Typography variant="caption">
                                Delivery Status:{' '}
                            </Typography>
                            <TextField
                                size="small"
                                sx={{ width: '12rem', background: 'white' }}
                                value={selectedDeliveryStatus}
                                onChange={(e) =>
                                    setSelectedDeliveryStatus(e.target.value)
                                }
                                select
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="processing">
                                    Processing
                                </MenuItem>
                                <MenuItem value="pending_payment">
                                    Pending Payment
                                </MenuItem>
                                <MenuItem value="oh_hold">On Hold</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="canceled">Canceled</MenuItem>
                                <MenuItem value="refunded">Refunded</MenuItem>
                            </TextField>
                        </Stack>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={!isLoading.delete && <DeleteOutline />}
                            onClick={clickDeleteHandler}
                            disabled={
                                orders.every((order) => !order.isSelected) ||
                                isLoading.delete
                            }
                            disableElevation
                        >
                            {isLoading.delete ? (
                                <CircularProgress size={16} />
                            ) : (
                                'Delete Selected'
                            )}
                        </Button>
                    </Stack>
                </ControlBar>
                <Widget>
                    {showAlert && errors.fetch ? (
                        <Alert
                            sx={{ textAlign: 'left' }}
                            severity="error"
                            variant="outlined"
                            onClose={() => setShowAlert(false)}
                        >
                            <AlertTitle>Error Occured!</AlertTitle>
                            {errors.fetch}
                        </Alert>
                    ) : (
                        ''
                    )}
                    <Stack textAlign="left">
                        <Typography variant="h5">Orders</Typography>
                    </Stack>
                    <Table
                        sx={{ minWidth: 650, overflowY: 'scroll' }}
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        onChange={clickSelectAllHandler}
                                        color="primary"
                                        indeterminate={
                                            orders.filter(
                                                (order) => order.isSelected
                                            ).length > 0 &&
                                            orders.filter(
                                                (order) => order.isSelected
                                            ).length < orders.length
                                        }
                                        checked={
                                            orders.filter(
                                                (order) => order.isSelected
                                            ).length > 0 &&
                                            orders.filter(
                                                (order) => order.isSelected
                                            ).length === orders.length
                                        }
                                        inputProps={{
                                            'aria-label': 'select all orders',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell align="right">Order By</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Billing</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading.fetch ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress size={48} />
                                    </TableCell>
                                </TableRow>
                            ) : orders.length <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Typography variant="h6">
                                            Uh oh! No order found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={order.isSelected}
                                                onChange={() =>
                                                    clickSelectHandler(
                                                        order._id
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack
                                                flexDirection="row"
                                                justifyContent="flex-start"
                                                gap="16px"
                                            >
                                                <Stack
                                                    alignItems="flex-start"
                                                    gap="8px"
                                                >
                                                    #{order._id}
                                                    <ButtonGroup
                                                        size="small"
                                                        variant="text"
                                                    >
                                                        <Button
                                                            onClick={() => {
                                                                navigate(
                                                                    `/dashboard/edit-order?id=${order._id}`
                                                                )
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Divider />
                                                        <Button
                                                            disabled={
                                                                isLoading.delete &&
                                                                selectedOrder?._id ===
                                                                    order._id
                                                            }
                                                            onClick={() => {
                                                                setSelectedOrder(
                                                                    order
                                                                )
                                                                dispatch(
                                                                    deleteOrderAsync(
                                                                        {
                                                                            ids: [
                                                                                order._id,
                                                                            ],
                                                                        }
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            {isLoading.delete &&
                                                            selectedOrder?._id ===
                                                                order._id ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                'Delete'
                                                            )}
                                                        </Button>
                                                    </ButtonGroup>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            {order?.customer?.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Pill
                                                color={
                                                    order?.delivery_status ===
                                                    'on_hold'
                                                        ? 'warn'
                                                        : order?.delivery_status ===
                                                          'processing'
                                                        ? 'info'
                                                        : order?.delivery_status ===
                                                          'completed'
                                                        ? 'success'
                                                        : 'error'
                                                }
                                                text={toCapitalize(
                                                    order?.delivery_status || ''
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack>
                                                <Typography variant="caption">{`${order.billing.address.full_name}, ${order.billing.address.phone_no}.`}</Typography>
                                                <Typography variant="caption">
                                                    {`${order.billing.address.country},
                                             ${order.billing.address.state}, 
                                             ${order.billing.address.city}, 
                                                            `}
                                                </Typography>
                                                <Typography variant="caption">{`${order.billing.address.address}.`}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack>
                                                <Typography variant="caption">
                                                    €
                                                    {order.billing.paid_amount.toFixed(
                                                        2
                                                    )}
                                                </Typography>
                                                <Typography variant="caption">
                                                    via [
                                                    {
                                                        order.billing
                                                            .payment_method
                                                    }
                                                    ]
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Date(
                                                order.created_at
                                            ).toDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={7} align="right">
                                    <TablePagination
                                        component="div"
                                        count={count}
                                        page={page - 1}
                                        onPageChange={(e, newPage) =>
                                            setPage(newPage + 1)
                                        }
                                        onRowsPerPageChange={(e) => {
                                            setRowsPerPage(
                                                parseInt(e.target.value, 10)
                                            )
                                            setPage(1)
                                        }}
                                        rowsPerPage={rowsPerPage}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Widget>
            </Stack>
        </AllOrdersStyled>
    )
}

export default AllOrders
