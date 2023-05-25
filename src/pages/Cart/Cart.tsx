import { useEffect, useState } from 'react'

import {
    AddOutlined,
    ArrowForward,
    DeleteOutline,
    PhotoAlbumOutlined,
    RemoveOutlined,
} from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Button,
    ButtonGroup,
    CircularProgress,
    Divider,
    IconButton,
    Table,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    Stack,
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

//Components
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import {
    addItemInUserCartAsync,
    removeItemFromUserCartAsync,
} from '../../store/cartReducer'
import { IProduct } from '../../store/productReducer'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Cart Styled
const CartStyled = styled.div``

//Section
const Section = styled.section`
    width: 100%;
    padding: 80px 48px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 48px;
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 6rem;
    height: 6rem;
    overflow: hidden;
    background: ${(props) => props.theme.palette.grey['300']};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3.4rem;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

/**
 ** ======================================================
 ** Component [Cart]
 ** ======================================================
 */
const Cart = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const user = useAppSelector((state) => state.auth.data)
    const {
        data: cart,
        isLoading,
        errors,
    } = useAppSelector((state) => state.cart)
    const dispatch = useAppDispatch()

    //State
    const [deleteAction, setDeleteAction] = useState(false)
    const [showAlert, setShowAlert] = useState(false)

    //Hooks
    const navigate = useNavigate()

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    useEffect(() => {
        //1) If user logged in then don't proceed
        if (user) return

        //2) User not logged in, redirect to login page
        navigate('/login', { replace: true })
    }, [])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
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
        dispatch(addItemInUserCartAsync({ data, cb: () => setShowAlert(true) }))
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
        dispatch(
            removeItemFromUserCartAsync({ data, cb: () => setShowAlert(true) })
        )
    }

    return (
        <CartStyled>
            <Header />
            <Section>
                {showAlert &&
                (errors.add_item || errors.fetch || errors.remove_item) ? (
                    <Alert
                        severity="error"
                        variant="outlined"
                        onClose={() => setShowAlert(false)}
                    >
                        <AlertTitle>Error Occured!</AlertTitle>
                        {errors.fetch || errors.add_item || errors.remove_item}
                    </Alert>
                ) : (
                    ''
                )}
                <Stack flexDirection="row" justifyContent="space-between">
                    <Typography variant="h3">
                        Cart (
                        {cart?.products.reduce(
                            (acc, item) => (acc += item.quantity),
                            0
                        ) || 0}
                        )
                    </Typography>
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Continue Shopping
                    </Button>
                </Stack>
                <Stack gap="16px">
                    {cart?.products.map((item) => (
                        <Stack
                            key={item.product._id}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="space-between"
                            gap="16px"
                        >
                            <Stack
                                display="flex"
                                alignItems="center"
                                flex="0 0 30%"
                                flexDirection="row"
                                gap="8px"
                            >
                                <ImageWrapper>
                                    {item?.product?.image?.url ? (
                                        <img
                                            src={item.product?.image?.url}
                                            alt={item.product?.image?.title}
                                        />
                                    ) : (
                                        <PhotoAlbumOutlined
                                            color="secondary"
                                            fontSize="inherit"
                                        />
                                    )}
                                </ImageWrapper>
                                <Stack>
                                    <Typography variant="h6">
                                        {item.product.title}
                                    </Typography>
                                    <Table
                                        sx={{
                                            maxWidth: 'max-content',
                                            '& tr > td': {
                                                padding: '0px',
                                                border: '0px',
                                            },
                                            '& tr > :not(:first-child)': {
                                                paddingLeft: '8px',
                                            },
                                        }}
                                    >
                                        {item.selected_variants.map(
                                            (variant) => (
                                                <TableRow key={variant.name}>
                                                    <TableCell>
                                                        <Typography
                                                            color="text.secondary"
                                                            variant="caption"
                                                        >
                                                            {variant.name}:
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption">
                                                            {variant.term}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </Table>
                                </Stack>
                            </Stack>
                            <Stack
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flex="0 0 30%"
                            >
                                <ButtonGroup
                                    variant="contained"
                                    disableElevation
                                    size="small"
                                    sx={{
                                        '& button, & p': {
                                            borderRadius: '0px',
                                        },
                                    }}
                                >
                                    <Button
                                        disabled={isLoading.remove_item}
                                        onClick={() => {
                                            setDeleteAction(false)
                                            removeItemFromCartHandler(
                                                item.product,
                                                1,
                                                item.selected_variants
                                            )
                                        }}
                                    >
                                        <RemoveOutlined fontSize="small" />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        component="p"
                                        disableRipple
                                        sx={{ cursor: 'text' }}
                                    >
                                        {item.quantity}
                                    </Button>
                                    <Button
                                        disabled={isLoading.add_item}
                                        onClick={() =>
                                            addItemInCartHandler(
                                                item.product,
                                                1,
                                                item.selected_variants
                                            )
                                        }
                                    >
                                        <AddOutlined fontSize="small" />
                                    </Button>
                                </ButtonGroup>
                            </Stack>
                            <Stack
                                display="flex"
                                justifyContent="flex-end"
                                alignItems="center"
                                flex="0 0 30%"
                                flexDirection="row"
                                gap="16px"
                            >
                                <Typography>
                                    &euro;
                                    {(
                                        item.product.selling_price ||
                                        item.product.price
                                    ).toFixed(2)}
                                </Typography>
                                <Tooltip title="Remove Item">
                                    <IconButton
                                        disabled={isLoading.add_item}
                                        onClick={() => {
                                            setDeleteAction(true)
                                            removeItemFromCartHandler(
                                                item.product,
                                                item.quantity,
                                                item.selected_variants
                                            )
                                        }}
                                    >
                                        {isLoading.remove_item &&
                                        deleteAction ? (
                                            <CircularProgress size={16} />
                                        ) : (
                                            <DeleteOutline />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
                <Stack alignSelf="flex-end" width="540px" gap="16px">
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography fontWeight="bold" variant="h5">
                            Subtotal
                        </Typography>
                        <Typography variant="h6">
                            &euro;
                            {cart?.products.reduce(
                                (acc, currItem) =>
                                    (acc +=
                                        (currItem.product.selling_price ||
                                            currItem.product.price) *
                                        currItem.quantity),
                                0
                            ) || (0).toFixed(2)}
                        </Typography>
                    </Stack>
                    <Divider />
                    <Button
                        sx={{ padding: '16px 24px' }}
                        size="large"
                        variant="contained"
                        disableElevation
                        endIcon={<ArrowForward />}
                        disabled={!(cart && cart.products.length > 0)}
                    >
                        Checkout
                    </Button>
                </Stack>
            </Section>
            <Footer />
        </CartStyled>
    )
}

export default Cart
