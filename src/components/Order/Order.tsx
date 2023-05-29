import {
    PhotoAlbumOutlined,
    RemoveRedEye,
    RemoveRedEyeOutlined,
    Star,
} from '@mui/icons-material'
import {
    Stack,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    useTheme,
    IconButton,
    Tooltip,
    Modal,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { IOrder } from '../../store/orderReducer'

//Components
import Pill from '../Pill'

//Hooks & Func
import { toCapitalize } from '../../utils/toCapitalize'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

//Modal Inner Container
const ModalInnerContainer = styled.div`
    width: 1200px;
    max-height: 90vh;
    background: ${(props) => props.theme.palette.secondary.main};
    border-radius: 16px;
    padding: 64px 48px;
    display: flex;
    flex-direction: column;
    gap: 48px;
    overflow-y: auto;
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: ${(props) => props.theme.palette.grey[300]};

    & img {
        width: 100%;
        height: 100%;
    }
`

/**
 ** ======================================================
 ** Component [Order]
 ** ======================================================
 */
const Order = (order: IOrder) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     **/
    //State
    const [showModal, setShowModal] = useState(false)

    //Hooks
    const theme = useTheme()
    const navigate = useNavigate()

    return (
        <Stack
            key={order._id}
            sx={{
                textAlign: 'left',
                border: `1px solid ${theme.palette.grey[300]}`,
            }}
        >
            <Stack
                flexDirection="row"
                sx={{
                    padding: '16px',
                    background: theme.palette.grey['300'],
                }}
            >
                <Stack flex="0 0 30%">
                    <Typography variant="caption">ORDER PLACED AT</Typography>
                    <Typography variant="caption">
                        {new Date(order.created_at).toDateString()}
                    </Typography>
                </Stack>
                <Stack flex="0 0 30%">
                    <Typography variant="caption">SHIP TO</Typography>
                    <Typography variant="caption">
                        {order.shipping.address.address}
                    </Typography>
                </Stack>
                <Stack flex="1" sx={{ textAlign: 'right' }}>
                    <Typography variant="caption">ORDER NO</Typography>
                    <Typography variant="caption">#{order._id}</Typography>
                </Stack>
            </Stack>
            <Stack sx={{ padding: '16px' }} gap="16px">
                <Stack flexDirection="row">
                    <Stack
                        flex={1}
                        flexDirection="row"
                        alignItems="center"
                        gap="8px"
                    >
                        <Typography variant="h6" fontWeight={300}>
                            Set to
                        </Typography>
                        <Box>
                            <Pill
                                color={
                                    order.delivery_status === 'processing' ||
                                    order.delivery_status === 'pending_payment'
                                        ? 'info'
                                        : order.delivery_status === 'on_hold'
                                        ? 'warn'
                                        : order.delivery_status === 'completed'
                                        ? 'success'
                                        : 'error'
                                }
                                text={toCapitalize(order.delivery_status || '')}
                            />
                        </Box>{' '}
                        <Typography variant="h6" fontWeight={300}>
                            on
                            {' ' +
                                new Date(
                                    order.status_changed_at
                                ).toDateString()}
                        </Typography>
                    </Stack>
                    <Stack flex="0 0 17%" gap="8px">
                        <Box alignSelf="flex-end" padding="0 24px">
                            <Tooltip title="View Details">
                                <IconButton onClick={() => setShowModal(true)}>
                                    <RemoveRedEye />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Stack>
                </Stack>
                <Stack flex={1} gap="16px">
                    {order.products.map((item) => (
                        <Card
                            key={item.product._id}
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 8px',
                            }}
                        >
                            <ImageWrapper>
                                {item.product?.image?.url ? (
                                    <img
                                        alt={item.product?.image?.title}
                                        src={item.product?.image?.url}
                                    />
                                ) : (
                                    <PhotoAlbumOutlined color="secondary" />
                                )}
                            </ImageWrapper>
                            <CardContent
                                sx={{
                                    flex: 1,
                                    textAlign: 'left',
                                }}
                            >
                                <Stack
                                    flexDirection="row"
                                    gap="8px"
                                    alignItems="center"
                                >
                                    <Typography>
                                        {item.product.title}
                                    </Typography>
                                    <Tooltip title="Give a review">
                                        <IconButton
                                            sx={{ marginLeft: 'auto' }}
                                            onClick={() =>
                                                navigate(
                                                    `/product/${item.product._id}?target=reviews`
                                                )
                                            }
                                        >
                                            <Star />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Stack>
            <Modal
                onClose={() => setShowModal(false)}
                open={showModal}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ModalInnerContainer>
                    <Typography variant="h4">Order Details</Typography>
                    <Stack
                        flexDirection="row"
                        gap="16px"
                        justifyContent="space-between"
                    >
                        <Stack flex="0 0 60%" gap="48px">
                            <Stack
                                sx={{
                                    padding: '16px 8px 0 8px',
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                }}
                            >
                                <Typography variant="h6">Summary</Typography>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Order</TableCell>
                                            <TableCell>
                                                #{order._id.toUpperCase()}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Delivery Status
                                            </TableCell>
                                            <TableCell>
                                                Set to{' '}
                                                {toCapitalize(
                                                    order.delivery_status || ''
                                                )}{' '}
                                                on{' '}
                                                {new Date(
                                                    order.status_changed_at
                                                ).toDateString()}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Payment</TableCell>
                                            <TableCell>
                                                &euro;
                                                {order.billing.paid_amount.toFixed(
                                                    2
                                                )}{' '}
                                                via [
                                                {order.billing.payment_method}]
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>
                                                Ordered on{' '}
                                                {new Date(
                                                    order.created_at
                                                ).toDateString()}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Stack>
                            <Stack
                                sx={{
                                    padding: '16px 8px 0 8px',
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                }}
                            >
                                <Typography>Items Cost Breakdown</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="right">
                                                Price
                                            </TableCell>
                                            <TableCell align="right">
                                                Quantity
                                            </TableCell>
                                            <TableCell align="right">
                                                Total
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.products.map((prod) => (
                                            <TableRow>
                                                <TableCell>
                                                    <Stack
                                                        flexDirection="row"
                                                        gap="8px"
                                                        alignItems="center"
                                                    >
                                                        <ImageWrapper>
                                                            {prod.product?.image
                                                                ?.url ? (
                                                                <img
                                                                    src={
                                                                        prod
                                                                            .product
                                                                            ?.image
                                                                            ?.url
                                                                    }
                                                                    alt={
                                                                        prod
                                                                            .product
                                                                            ?.image
                                                                            ?.title
                                                                    }
                                                                />
                                                            ) : (
                                                                <PhotoAlbumOutlined color="secondary" />
                                                            )}
                                                        </ImageWrapper>
                                                        <Stack gap="8px">
                                                            {
                                                                prod?.product
                                                                    ?.title
                                                            }
                                                            <Table
                                                                sx={{
                                                                    '& tr td': {
                                                                        padding:
                                                                            '0 8px 0 0',
                                                                    },
                                                                }}
                                                            >
                                                                <TableBody>
                                                                    {prod.selected_variants.map(
                                                                        (
                                                                            variant
                                                                        ) => (
                                                                            <TableRow>
                                                                                <TableCell>
                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        color="gray"
                                                                                    >
                                                                                        {
                                                                                            variant.name
                                                                                        }

                                                                                        :
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        fontWeight="bold"
                                                                                        color="GrayText"
                                                                                    >
                                                                                        {
                                                                                            variant.term
                                                                                        }
                                                                                    </Typography>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </Stack>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">
                                                    &euro;
                                                    {(
                                                        prod.product
                                                            .selling_price ||
                                                        prod.product.price
                                                    ).toFixed(2)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {prod.quantity}
                                                </TableCell>
                                                <TableCell align="right">
                                                    &euro;
                                                    {(
                                                        (prod.product
                                                            .selling_price ||
                                                            prod.product
                                                                .price) *
                                                        prod.quantity
                                                    ).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                align="right"
                                            >
                                                <Typography>
                                                    Subtotal:
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    fontWeight="bold"
                                                    color="GrayText"
                                                >
                                                    &euro;{' '}
                                                    {order.products
                                                        .reduce(
                                                            (acc, prod) =>
                                                                (acc +=
                                                                    (prod
                                                                        .product
                                                                        .selling_price ||
                                                                        prod
                                                                            .product
                                                                            .price) *
                                                                    prod.quantity),
                                                            0
                                                        )
                                                        .toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Stack>
                        </Stack>
                        <Stack flex="0 0 30%" gap="48px">
                            <Stack
                                sx={{
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                    padding: '16px 8px 0 8px',
                                }}
                            >
                                <Typography variant="h6">
                                    Billing Address
                                </Typography>
                                <Table
                                    sx={{
                                        '& tr:last-child td': {
                                            'border-bottom': '0px',
                                        },
                                    }}
                                >
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>
                                                {
                                                    order.billing.address
                                                        .full_name
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Phone Number</TableCell>
                                            <TableCell>
                                                {order.billing.address.phone_no}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Property Type</TableCell>
                                            <TableCell>
                                                {order.billing.address.property_type.toUpperCase()}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Country</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.billing.address
                                                        .country
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>State</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.billing.address.state
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>City</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.billing.address.city
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Full Address</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.billing.address
                                                        .address
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Zip Code</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.billing.address
                                                        .zip_code
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Stack>
                            <Stack
                                sx={{
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                    padding: '16px 8px 0 8px',
                                }}
                            >
                                <Typography variant="h6">
                                    Shipping Address
                                </Typography>
                                <Table
                                    sx={{
                                        '& tr:last-child td': {
                                            'border-bottom': '0px',
                                        },
                                    }}
                                >
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>
                                                {
                                                    order.shipping.address
                                                        .full_name
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Phone Number</TableCell>
                                            <TableCell>
                                                {
                                                    order.shipping.address
                                                        .phone_no
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Property Type</TableCell>
                                            <TableCell>
                                                {order.shipping.address.property_type.toUpperCase()}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Country</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.shipping.address
                                                        .country
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>State</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.shipping.address.state
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>City</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.shipping.address.city
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Full Address</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.shipping.address
                                                        .address
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Zip Code</TableCell>
                                            <TableCell>
                                                {toCapitalize(
                                                    order.shipping.address
                                                        .zip_code
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Stack>
                        </Stack>
                    </Stack>
                </ModalInnerContainer>
            </Modal>
        </Stack>
    )
}

export default Order
