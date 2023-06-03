import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react'

import { DeleteOutline } from '@mui/icons-material'
import {
    Tab,
    Tabs,
    useTheme,
    Box,
    Stack,
    Autocomplete,
    TextField,
    TextFieldProps,
    MenuItem,
    Typography,
    Button,
    Modal,
    TableHead,
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    TableFooter,
    CircularProgress,
    Alert,
    AlertTitle,
} from '@mui/material'
import { TouchRippleActions } from '@mui/material/ButtonBase/TouchRipple'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { searchUserAsync } from '../../../store/userReducer'
import { IProduct, searchProductAsync } from '../../../store/productReducer'
import {
    createOrderAsync,
    IOrder,
    updateOrderAsync,
} from '../../../store/orderReducer'

//Components
import AddressView, {
    IAddress,
} from '../../../components/AddressView/AddressView'

//Hooks & Func
import useInput from '../../../hooks/useInput'
import { combineValidators, isAlphaNumeric } from '../../../utils/validators'

/**
 ** ======================================================
 ** Interface [TabPanelProps]
 ** ======================================================
 */
interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

/**
 ** ======================================================
 ** Component [TabPanel]
 ** ======================================================
 */
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ width: '100%' }}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Order View
const OrderViewStyled = styled.div`
    border: 1px solid black;
    margin: 32px 0;
    display: flex;
`

//Modal Inner Container
const ModalInnerContainer = styled.div`
    width: 600px;
    height: max-content;
    padding: 40px;
    background: ${(props) => props.theme.palette.secondary.main};
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
    border-radius: 8px;
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
 ** Component [OrderView]
 ** ======================================================
 */
const OrderView = ({
    mode = 'ADD_NEW',
    order,
}: {
    mode?: 'EDIT' | 'ADD_NEW'
    order?: IOrder
}) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const { isLoading, errors } = useAppSelector((state) => state.order)
    const dispatch = useAppDispatch()
    const users = useAppSelector((state) => state.user.data)
    const products = useAppSelector((state) => state.product.data)

    //State
    const [showAlert, setShowAlert] = useState(false)
    const [showModal, setShowModal] = useState(false)

    //Date, Delivery status & Payment method
    const [deliveryStatus, setDeliveryStatus] = useState('processing')
    const [date, setDate] = useState(
        new Date(Date.now()).toISOString().slice(0, 10)
    )
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')

    //Selected Prodcut & Customer
    const [selectedCustomer, setSeletedCustomer] = useState<{
        label: string
        _id: string
        addresses: Array<IAddress>
    } | null>(
        order?.customer
            ? {
                  label: order.customer.username,
                  _id: order.customer._id,
                  addresses: [
                      {
                          ...order.billing.address,
                      },
                      {
                          ...order.shipping.address,
                      },
                  ],
              }
            : null
    )
    const [selectedProduct, setSeletedProduct] = useState<{
        label: string
        product: IProduct
    } | null>()

    //Addresses
    const [billingAddress, setBillingAddress] = useState<IAddress>()
    const [shippingAddress, setShippingAddress] = useState<IAddress>()

    //Items
    const [items, setItems] = useState<
        Array<{
            product: IProduct
            selected_variants: Array<{
                name: string
                term: string
            }>
            quantity: number
        }>
    >([])

    //Theme
    const theme = useTheme()

    //Tabs
    const [activeTab, setActiveTab] = useState(0)
    const tabs = ['General', 'Billing', 'Shipping', 'Items']

    //Refs
    const refInputCustomer = useRef<HTMLInputElement>(null)
    const refInputTransactionId = useRef<HTMLInputElement>(null)
    const refAddItemButton = useRef<TouchRippleActions>(null)
    const timeOutID = useRef<{ id: ReturnType<typeof setTimeout> | null }>({
        id: null,
    })

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Set customer's default addresses
    useEffect(() => {
        //1) Validate
        if (!selectedCustomer) return

        //2) Set billing address
        const billingAddress = selectedCustomer.addresses.find(
            (add) => add.default_billing_address
        )
        if (billingAddress) setBillingAddress(billingAddress)

        //3) Set shipping address
        const shippingAddress = selectedCustomer.addresses.find(
            (add) => add.default_shipping_address
        )
        if (shippingAddress) setShippingAddress(shippingAddress)
    }, [selectedCustomer])

    //Set default on edit mode
    useEffect(() => {
        //1) Validate
        if (!order) return

        //2) Set fields
        setSeletedCustomer({
            label: order.customer.username,
            _id: order.customer._id,
            addresses: [
                {
                    ...order.billing.address,
                },
                {
                    ...order.shipping.address,
                },
            ],
        })
        setDeliveryStatus(order.delivery_status || '')
        setDate(order.created_at.slice(0, 10))
        setPaymentMethod(order.billing.payment_method)
        setItems(order.products)
    }, [order])

    /*
     ** **
     ** ** ** Form fields
     ** **
     */
    const inputTransactionId = useInput({
        default_value: order?.billing?.transaction_id || '',
        validation: combineValidators([
            {
                validator: isAlphaNumeric,
                message: 'Please enter a valid transaction id.',
                options: {
                    ignoreCase: true,
                    ignoreDashes: true,
                    ignoreHyphens: true,
                },
            },
        ]),
    })

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //On change input handler
    const onChangeHandler = (
        e: SyntheticEvent<Element, Event>,
        query: string
    ) => {
        //1) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //2) Refetch users when query empty again
        if (!query || query.length <= 0) {
            return
        }

        //3) Set timeout to fetch user via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchUserAsync(query))
        }, 300)
    }

    //Select prodcut handler
    const onChangeSelectProductHandler = (
        e: SyntheticEvent<Element, Event>,
        query: string
    ) => {
        //1) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //2) Refetch users when query empty again
        if (!query || query.length <= 0) {
            return
        }

        //3) Set timeout to fetch user via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchProductAsync(query))
        }, 300)
    }

    //On change select variant handler
    const onChangeSelectVariantHandler = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        variantName: string,
        itemId: string
    ) => {
        setItems(
            items.map((item) => {
                if (item.product._id === itemId)
                    return {
                        ...item,
                        selected_variants: item.selected_variants.map(
                            (variant) => {
                                if (variant.name === variantName) {
                                    return {
                                        ...variant,
                                        term: e.target.value,
                                    }
                                }
                                return variant
                            }
                        ),
                    }
                return item
            })
        )
    }

    //Click add item handler
    const clickAddItemHandler = () => {
        //1) Validate
        if (!selectedProduct) return

        //2) Make a copy
        const updItems = [...items]

        //3) Check if items exists
        const ind = items.findIndex(
            (item) => item.product._id === selectedProduct.product._id
        )

        //4) If item already exists, increment quantity by 1, else push new item
        if (ind !== -1) {
            updItems[ind] = {
                ...updItems[ind],
                quantity: updItems[ind].quantity + 1,
            }
            setItems(updItems)
        } else {
            items.push({
                product: selectedProduct.product,
                quantity: 1,
                selected_variants: selectedProduct.product.variants.map(
                    (variant) => ({
                        name: variant.name,
                        term: variant.terms[0].name,
                    })
                ),
            })
        }

        //5 Clear selected product
        setSeletedProduct(undefined)

        //6) Hide modal
        setShowModal(false)
    }

    //Click reset handler
    const clickResetHandler = () => {
        //1) Clear selected fields
        setSeletedCustomer(null)
        setDeliveryStatus('processing')
        setDate(new Date(Date.now()).toISOString().slice(0, 10))
        setPaymentMethod('cash_on_delivery')
        setBillingAddress(undefined)
        setShippingAddress(undefined)
        setItems([])

        //2) Clear inputs
        inputTransactionId.reset(false)

        //3) Set active tab to default
        setActiveTab(0)
    }

    //Click action handler
    const clickActionHandler = () => {
        //1) Hide modal
        setShowAlert(false)

        //2) Validate
        if (!selectedCustomer) {
            setActiveTab(0)
            return refInputCustomer.current?.focus()
        } else if (items.length <= 0) {
            setActiveTab(3)
            refAddItemButton.current?.start()
            window.setTimeout(() => {
                refAddItemButton.current?.stop()
            }, 100)

            return
        }

        //3) No errors, create form data
        const formData = new FormData()
        formData.append('customer', selectedCustomer._id)
        formData.append('products', JSON.stringify(items))
        formData.append('delivery_status', deliveryStatus)
        formData.append('created_at', date)
        formData.append('shipping[address]', JSON.stringify(shippingAddress))
        formData.append('billing[address]', JSON.stringify(billingAddress))
        formData.append('billing[payment_method]', paymentMethod)
        formData.append('billing[transaction_id]', inputTransactionId.value)
        formData.append(
            'billing[paid_amount]',
            items
                .reduce(
                    (acc, item) =>
                        (acc +=
                            (item.product?.selling_price ||
                                item.product.price) * item.quantity),
                    0
                )
                .toString()
        )

        //4) Dispatch action to create order
        if (mode === 'ADD_NEW')
            return dispatch(
                createOrderAsync({
                    formData,
                    cb: (order) => {
                        if (order) clickResetHandler()
                        setShowAlert(true)
                    },
                })
            )

        //5) Dispatch action to update order
        dispatch(
            updateOrderAsync({
                id: order?._id || '',
                formData,
                cb: () => {
                    setShowAlert(true)
                },
            })
        )
    }

    return (
        <>
            <OrderViewStyled>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    aria-label="Profile tabs"
                    sx={{
                        borderRight: '1px solid black',
                        width: '300px',
                    }}
                >
                    {tabs.map((tab, i) => (
                        <Tab
                            key={i}
                            style={{
                                width: '100%',
                                padding: '24px 32px',
                                textAlign: 'right',
                                backgroundColor:
                                    activeTab === i
                                        ? theme.palette.grey[100]
                                        : '',
                                borderBottom:
                                    i >= tabs.length - 1
                                        ? '0'
                                        : `1px solid ${theme.palette.grey[300]}`,
                            }}
                            label={tab}
                        />
                    ))}
                </Tabs>
                <Stack flex={1}>
                    {showAlert && (
                        <Alert
                            sx={{ textAlign: 'left', margin: '16px' }}
                            severity={
                                errors.create || errors.update
                                    ? 'error'
                                    : 'success'
                            }
                            variant="outlined"
                            onClose={() => setShowAlert(false)}
                        >
                            <AlertTitle>
                                {errors.create || errors.update
                                    ? 'Error Occured!'
                                    : 'Success!'}
                            </AlertTitle>
                            {errors.create ||
                                errors.update ||
                                'Order has been created successfully.'}
                        </Alert>
                    )}
                    <TabPanel value={activeTab} index={0}>
                        <Stack gap="16px">
                            <Stack>
                                <Stack flex={1}>
                                    <Autocomplete
                                        onInputChange={onChangeHandler}
                                        onChange={(_, val) =>
                                            val && setSeletedCustomer(val)
                                        }
                                        value={selectedCustomer}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        disablePortal
                                        options={users.map((user) => ({
                                            label: user.username,
                                            _id: user._id,
                                            addresses: user.addresses,
                                        }))}
                                        noOptionsText={`Type few characters to get suggestions`}
                                        renderInput={(
                                            params: TextFieldProps
                                        ) => (
                                            <TextField
                                                {...params}
                                                inputRef={refInputCustomer}
                                                label="Customer"
                                            />
                                        )}
                                    />
                                </Stack>
                            </Stack>
                            <Stack flexDirection="row" gap="16px">
                                <Stack flex={1}>
                                    <TextField
                                        value={deliveryStatus}
                                        onChange={(e) =>
                                            setDeliveryStatus(e.target.value)
                                        }
                                        variant="outlined"
                                        select
                                    >
                                        <MenuItem value="processing">
                                            Processing
                                        </MenuItem>
                                        <MenuItem value="pending_payment">
                                            Pending Payment
                                        </MenuItem>
                                        <MenuItem value="on_hold">
                                            On Hold
                                        </MenuItem>
                                        <MenuItem value="completed">
                                            Completed
                                        </MenuItem>
                                        <MenuItem value="canceled">
                                            Canceled
                                        </MenuItem>
                                        <MenuItem value="refunded">
                                            Refunded
                                        </MenuItem>
                                    </TextField>
                                </Stack>
                                <Stack flex={1}>
                                    <TextField
                                        label="Date"
                                        type="date"
                                        onChange={(e) => {
                                            setDate(e.target.value)
                                        }}
                                        value={date}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <Stack>
                            {!selectedCustomer ? (
                                <Typography>
                                    Select customer first to see the options
                                    here.
                                </Typography>
                            ) : (
                                <Stack gap="16px">
                                    <AddressView
                                        mode="EDIT"
                                        onSave={(address, closeModal) => {
                                            setBillingAddress(address)
                                            closeModal()
                                        }}
                                        address={billingAddress}
                                    />
                                    <Stack flexDirection="row" gap="16px">
                                        <Stack flex={1}>
                                            <TextField
                                                label="Payment Method"
                                                value={paymentMethod}
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                                select
                                            >
                                                <MenuItem value="cash_on_delivery">
                                                    Cash On Delivery
                                                </MenuItem>
                                                <MenuItem value="card">
                                                    Card
                                                </MenuItem>
                                            </TextField>
                                        </Stack>
                                        <Stack flex={1}>
                                            <TextField
                                                label="Transaction ID"
                                                value={inputTransactionId.value}
                                                onChange={
                                                    inputTransactionId.onChangeHandler
                                                }
                                                onBlur={
                                                    inputTransactionId.onBlurHandler
                                                }
                                                error={
                                                    inputTransactionId
                                                        .validation.error
                                                }
                                                helperText={
                                                    inputTransactionId
                                                        .validation.message
                                                }
                                                inputRef={refInputTransactionId}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </TabPanel>
                    <TabPanel value={activeTab} index={2}>
                        <Stack>
                            {!selectedCustomer ? (
                                <Typography>
                                    Select customer to see here.
                                </Typography>
                            ) : (
                                <AddressView
                                    mode="EDIT"
                                    onSave={(address, closeModal) => {
                                        setShippingAddress(address)
                                        closeModal()
                                    }}
                                    address={shippingAddress}
                                />
                            )}
                        </Stack>
                    </TabPanel>
                    <TabPanel value={activeTab} index={3}>
                        <Stack gap="40px">
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">
                                            Cost
                                        </TableCell>
                                        <TableCell align="right">
                                            Quantity
                                        </TableCell>
                                        <TableCell align="right">
                                            Total
                                        </TableCell>
                                        <TableCell align="right">
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <Stack
                                                    flexDirection="row"
                                                    gap="8px"
                                                >
                                                    <ImageWrapper>
                                                        <img
                                                            src={
                                                                item.product
                                                                    ?.image?.url
                                                            }
                                                            alt={
                                                                item.product
                                                                    ?.image
                                                                    ?.title
                                                            }
                                                            crossOrigin="anonymous"
                                                        />
                                                    </ImageWrapper>
                                                    <Stack>
                                                        {item.product.title}
                                                        <Stack
                                                            flexDirection="row"
                                                            gap="8px"
                                                            flexWrap="wrap"
                                                        >
                                                            {item.product.variants.map(
                                                                (variant) => (
                                                                    <TextField
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            onChangeSelectVariantHandler(
                                                                                e,
                                                                                variant.name,
                                                                                item
                                                                                    .product
                                                                                    ._id
                                                                            )
                                                                        }
                                                                        size="small"
                                                                        key={
                                                                            variant.name
                                                                        }
                                                                        value={
                                                                            item.selected_variants.find(
                                                                                (
                                                                                    vari
                                                                                ) =>
                                                                                    vari.name ===
                                                                                    variant.name
                                                                            )
                                                                                ?.term ||
                                                                            ''
                                                                        }
                                                                        select
                                                                    >
                                                                        {variant.terms.map(
                                                                            (
                                                                                term
                                                                            ) => (
                                                                                <MenuItem
                                                                                    value={
                                                                                        term.name
                                                                                    }
                                                                                    key={
                                                                                        term.name
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        term.name
                                                                                    }
                                                                                </MenuItem>
                                                                            )
                                                                        )}
                                                                    </TextField>
                                                                )
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right">
                                                &euro;
                                                {item.product.selling_price?.toFixed(
                                                    2
                                                ) ||
                                                    item.product.price.toFixed(
                                                        2
                                                    )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell align="right">
                                                &euro;
                                                {(
                                                    (item.product
                                                        .selling_price ||
                                                        item.product.price) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() =>
                                                        setItems(
                                                            items.filter(
                                                                (itm) =>
                                                                    item.product
                                                                        ._id !==
                                                                    itm.product
                                                                        ._id
                                                            )
                                                        )
                                                    }
                                                >
                                                    <DeleteOutline />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell
                                            align="right"
                                            colSpan={4}
                                            sx={{ borderBottom: 'none' }}
                                        >
                                            <Typography>
                                                Items Subtotal
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ borderBottom: 'none' }}
                                        >
                                            <Typography>
                                                &euro;
                                                {items
                                                    .reduce((acc, item) => {
                                                        return (acc +=
                                                            (item.product
                                                                .selling_price ||
                                                                item.product
                                                                    .price) *
                                                            item.quantity)
                                                    }, 0)
                                                    .toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right" colSpan={4}>
                                            <Typography>Order Total</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography>
                                                &euro;
                                                {items
                                                    .reduce((acc, item) => {
                                                        return (acc +=
                                                            (item.product
                                                                .selling_price ||
                                                                item.product
                                                                    .price) *
                                                            item.quantity)
                                                    }, 0)
                                                    .toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            <Stack marginTop="auto" alignItems="flex-end">
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowModal(true)}
                                    touchRippleRef={refAddItemButton}
                                >
                                    Add Item
                                </Button>
                            </Stack>
                            <Modal
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                open={showModal}
                                onClose={() => {
                                    setSeletedProduct(undefined)
                                    setShowModal(false)
                                }}
                            >
                                <ModalInnerContainer>
                                    <Typography variant="h6">
                                        Search for product to add
                                    </Typography>
                                    <Autocomplete
                                        onInputChange={
                                            onChangeSelectProductHandler
                                        }
                                        onChange={(_, val) =>
                                            val
                                                ? setSeletedProduct(val)
                                                : setSeletedProduct(null)
                                        }
                                        value={selectedProduct}
                                        disablePortal
                                        options={products.map((prod) => ({
                                            label: prod.title,
                                            product: prod,
                                        }))}
                                        noOptionsText={`Type few characters to get suggestions`}
                                        renderInput={(
                                            params: TextFieldProps
                                        ) => (
                                            <TextField
                                                {...params}
                                                label="Product"
                                            />
                                        )}
                                    />

                                    <Stack
                                        flexDirection="row"
                                        gap="8px"
                                        alignSelf="flex-end"
                                        marginTop="auto"
                                    >
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setSeletedProduct(undefined)
                                                setShowModal(false)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={!selectedProduct}
                                            variant="contained"
                                            onClick={clickAddItemHandler}
                                        >
                                            Okay
                                        </Button>
                                    </Stack>
                                </ModalInnerContainer>
                            </Modal>
                        </Stack>
                    </TabPanel>
                </Stack>
            </OrderViewStyled>
            <Stack
                flexDirection="row"
                gap="16px"
                sx={{ paddingBottom: '32px' }}
            >
                <Button
                    size="large"
                    variant="contained"
                    onClick={clickActionHandler}
                    disableElevation
                    disabled={isLoading.create || isLoading.update}
                    sx={{ padding: '16px 48px' }}
                >
                    {isLoading.create || isLoading.update ? (
                        <CircularProgress size={16} />
                    ) : mode === 'EDIT' ? (
                        'Update Order'
                    ) : (
                        'Create New Order'
                    )}
                </Button>
                <Button
                    size="large"
                    variant="outlined"
                    onClick={clickResetHandler}
                    sx={{ padding: '16px 48px' }}
                >
                    Clear Fields
                </Button>
            </Stack>
        </>
    )
}

export default OrderView
