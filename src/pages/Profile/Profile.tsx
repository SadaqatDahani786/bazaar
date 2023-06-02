import { SyntheticEvent, useEffect, useRef, useState } from 'react'

import { EditOutlined, HomeOutlined, PhotoCamera } from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    ButtonGroup,
    CircularProgress,
    Divider,
    IconButton,
    Link,
    MenuItem,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'

import styled from 'styled-components'
import { GenericFormData } from 'axios'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import { getCountriesAsync } from '../../store/locationReducer'
import { updateCurrentUserAsync } from '../../store/userReducer'
import {
    setUser as setAuthUser,
    updatePasswordAsync,
} from '../../store/authReducer'
import { getMyOrdersAsync, IOrder } from '../../store/orderReducer'
import {
    deleteReviewAsync,
    deleteUserProductReviewAsync,
    getMyManyReviewAsync,
    IReview,
    updateReviewAsync,
    updateUserProductReviewAsync,
} from '../../store/reviewReducer'

//Types
import { ActionType, IUserAuth } from '../Dashboard/Customer/Profile/Profile'

//Components
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'
import AddressView from '../../components/AddressView'
import Order from '../../components/Order'
import Review from '../../components/Review'
import { IAddress } from '../../components/AddressView/AddressView'

//Hooks & Func
import useInput from '../../hooks/useInput'
import useUpload from '../../hooks/useUpload'
import splitNumberByCode from '../../utils/splitNumberByCode'
import {
    combineValidators,
    isAlpha,
    isAlphaNumeric,
    isEmail,
    isEmpty,
    isMaxLength,
    isPassMissmatched,
    isPassStrong,
    isPhoneNumber,
} from '../../utils/validators'

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
//Profile
const ProfileStyled = styled.div`
    width: 100%;
`

//Section
const Section = styled.div`
    width: 100%;
    padding: 48px 180px;
    display: flex;
    flex-direction: column;
    gap: 48px;
`

//Wrapper
const TabsWrapper = styled.div`
    border: 1px solid black;
    display: flex;
`

//Toolbar
const Toolbar = styled.div`
    height: 5rem;
    padding: 0 180px;
    margin-top: 48px;
    border-top: 1px solid #0000002f;
    border-bottom: 1px solid #0000002f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
`

/**
 ** ======================================================
 ** Component [Profile]
 ** ======================================================
 */
const Profile = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const authUser = useAppSelector((state) => state.auth.data)
    const isLoading = useAppSelector((state) => state.user.isLoading)
    const errors = useAppSelector((state) => state.user.errors)
    const countries = useAppSelector((state) => state.location.data)
    const {
        data: reviews,
        isLoading: isLoadingReview,
        errors: errorsReview,
        count: countReviews,
    } = useAppSelector((state) => state.review)
    const {
        isLoading: isLoadingOrder,
        errors: errorsOrder,
        count: countOrder,
    } = useAppSelector((state) => state.order)
    const dispatch = useAppDispatch()

    //State
    const [user, setUser] = useState<IUserAuth>()
    const [selectedCountryCode, setSelectedCountryCode] = useState('select')
    const [showAlert, setShowAlert] = useState(false)
    const [showAlertSuccess, setShowAlertSuccess] = useState(false)

    const [allOrders, setAllOrders] = useState<IOrder[]>([])
    const [pageOrder, setPageOrder] = useState(1)

    const [allReviews, setAllReviews] = useState<IReview[]>([])
    const [pageReview, setPageReview] = useState(1)
    const [selectedActionReview, setSelectedActionReview] = useState('')

    //Hooks
    const theme = useTheme()
    const navigate = useNavigate()

    //Tab
    const [activeTab, setActiveTab] = useState(0)
    const [activeTabOrder, setActiveTabOrder] = useState(0)
    const tabs = ['Profile', 'My Account', 'Addresses', 'Orders', 'Reviews']

    //Refs
    const ranFetchReview = useRef(false)

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Photo
    const inputProfilePhoto = useUpload({
        default_value: user?.photo
            ? [{ name: user?.photo.title, url: user.photo.url }]
            : undefined,
    })

    //Name
    const inputName = useInput({
        default_value: user?.name.value || '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: "What's your name?",
            },
            {
                validator: isAlpha,
                message:
                    'Full name must only contain letters or whitespaces. No special characters are allowed.',
                options: { ignoreSpaces: true, ignoreCase: true },
            },
            {
                validator: isMaxLength,
                message: 'Full name must be 60 characters long or less.',
                options: { max: 60 },
            },
        ]),
    })

    //Phone number
    const inputPhoneNumber = useInput({
        default_value: splitNumberByCode(user?.phone_no.value).number,
        validation: combineValidators([
            {
                validator: isEmpty,
                message: "What's your phone number?",
            },
            {
                validator: isPhoneNumber,
                message: 'Please provide a valid phone number.',
            },
        ]),
    })

    //Bio
    const inputBio = useInput({
        default_value: user?.bio.value || '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message:
                    'Tell us who you\re and tell us about your interesting personlity.',
            },
            {
                validator: isAlphaNumeric,
                message:
                    'Must only contain letters, numbers or puntuations, no other special characters are allowed.',
                options: {
                    ignoreCase: true,
                    ignorePunctuations: true,
                    ignoreSpaces: true,
                },
            },
        ]),
    })

    //Username
    const inputUsername = useInput({
        default_value: user?.username.value || '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please give us a unique username for your account.',
            },
            {
                validator: isAlphaNumeric,
                message:
                    'Username must only contains letter, numbers or dash. No whitespace or special characters are allowed. ',
                options: { ignoreDashes: true },
            },
        ]),
    })

    //Email
    const inputEmail = useInput({
        default_value: user?.email.value || '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: "What's your email address?",
            },
            {
                validator: isEmail,
                message: 'Please enter a valid email address.',
            },
        ]),
    })

    //Current password
    const inputCurrPassword = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please enter your current password.',
            },
        ]),
    })

    //Password
    const inputPassword = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please enter a password for your account.',
            },
            {
                validator: isPassStrong,
                message:
                    'Password must be 8 characters long, and should contain numbers and special characters [!@#$&*].',
            },
        ]),
    })

    //Password confirm
    const inputPasswordConfirm = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please confirm your password.',
            },
            {
                validator: isPassMissmatched,
                message: 'Password and password confirm mismatched.',
                options: {
                    password: inputPassword.value,
                },
            },
        ]),
    })

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch countries
    useEffect(() => {
        dispatch(getCountriesAsync())
    }, [])

    //Navigate to login if user not logged in
    useEffect(() => {
        //1) If user not logged in, redirect to login page
        if (
            !localStorage.getItem('user_id') ||
            !localStorage.getItem('user_role')
        )
            return navigate('/login', { replace: true })
    }, [authUser])

    //Set country code
    useEffect(() => {
        //1) Validate
        if (countries.length <= 0 || !user) return

        //2) Extract country from full number
        const countryCode = splitNumberByCode(
            user.phone_no.value
        ).country_code.substring(1)

        //3) Set country code
        if (countryCode) setSelectedCountryCode(countryCode)
    }, [countries])

    //Fetch reviews
    useEffect(() => {
        dispatch(
            getMyManyReviewAsync([
                {
                    key: 'page',
                    value: pageReview.toString(),
                },
            ])
        )
    }, [pageReview])

    //Set reviews
    useEffect(() => {
        if (ranFetchReview.current || reviews.length <= 0) return

        ranFetchReview.current = true

        setAllReviews((state) => [...state, ...reviews])
    }, [reviews])

    //Fetch orders
    useEffect(() => {
        setPageOrder(1)
        getOrders(1)
    }, [activeTabOrder])

    //Set user from authenticated user
    useEffect(() => {
        if (!authUser) return

        setUser({
            ...authUser,
            bio: { value: authUser.bio, edit: false },
            name: { value: authUser.name, edit: false },
            username: { value: authUser.username, edit: false },
            phone_no: { value: authUser.phone_no, edit: false },
            email: { value: authUser.email, edit: false },
            password: { value: '********', edit: false },
        })
    }, [authUser])

    //Update profile photo
    useEffect(() => {
        //1) Validate
        if (
            !inputProfilePhoto.modified ||
            inputProfilePhoto.value.length <= 0 ||
            !inputProfilePhoto.value[0].file
        )
            return

        //2) Prepare form data
        const formData = new FormData()
        formData.append('photo', inputProfilePhoto.value[0].file)

        //3) Dispatch action to make request
        dispatch(
            updateCurrentUserAsync({
                formData,
                cb: (updateduser) => {
                    setShowAlert(true)
                    updateduser && setAuthUser(updateduser)
                },
                isMultipart: true,
            })
        )
    }, [inputProfilePhoto.value])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click edit handler
    const clickEditHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
        //1) Get type
        const type = e.currentTarget.dataset.type as ActionType

        //2) Check for each type and do the action for it
        if (type === 'name') {
            setUser((state) => {
                if (!state) return
                return {
                    ...state,
                    name: {
                        value: state.name.value || '',
                        edit: !state.name.edit,
                    },
                }
            })
            inputName.reset(true)
        } else if (type === 'phone_no') {
            setUser((state) => {
                if (!state) return
                return {
                    ...state,
                    phone_no: {
                        value: state.phone_no.value || '',
                        edit: !state.phone_no.edit,
                    },
                }
            })

            inputPhoneNumber.reset(true)
        } else if (type === 'bio') {
            setUser((state) => {
                if (!state) return
                return {
                    ...state,
                    bio: {
                        value: state.bio.value || '',
                        edit: !state.bio.edit,
                    },
                }
            })
            inputBio.reset(true)
        } else if (type === 'username') {
            setUser((state) => {
                if (!state) return
                return {
                    ...state,
                    username: {
                        value: state.username.value || '',
                        edit: !state.username.edit,
                    },
                }
            })
        } else if (type === 'email') {
            setUser((state) => {
                if (!state) return
                return {
                    ...state,
                    email: {
                        value: state.email.value || '',
                        edit: !state.email.edit,
                    },
                }
            })
            inputEmail.reset(true)
        } else if (type === 'password') {
            setUser((state) => {
                if (!state) return
                return {
                    ...state,
                    password: {
                        value: state.password.value || '',
                        edit: !state.password.edit,
                    },
                }
            })
            inputPassword.reset(false)
            inputCurrPassword.reset(false)
            inputPasswordConfirm.reset(false)
        }
    }

    //Click save handler
    const clickSaveHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
        //1) Hide alert
        setShowAlertSuccess(false)

        //2) validate
        if (!user) return

        //3) Get type from event
        const type = e.currentTarget.dataset.type as ActionType

        //4) Form data
        const formData = new FormData()

        //5) if password, update password and return
        if (type === 'password') {
            //=> Append passwords in form data
            formData.append('password', inputCurrPassword.value)
            formData.append('newPassword', inputPassword.value)
            formData.append('newPasswordConfirm', inputCurrPassword.value)

            //=> Dispatch action to update password of currently logged in user
            return dispatch(
                updatePasswordAsync({
                    formData,
                    cb: () => {
                        setShowAlertSuccess(true)
                        setUser({
                            ...user,
                            password: {
                                value: user.password.value,
                                edit: false,
                            },
                        })
                    },
                })
            )
        }

        //6) else if, update profile
        if (type === 'name') {
            formData.append('name', inputName.value)
            dispatch(
                updateCurrentUserAsync({
                    formData,
                    cb: (updateduser) => {
                        setShowAlertSuccess(true)
                        setUser({
                            ...user,
                            name: { value: user.name.value, edit: false },
                        })
                        if (updateduser) dispatch(setAuthUser(updateduser))
                    },
                })
            )
        } else if (type === 'username') {
            formData.append('username', inputUsername.value)
            dispatch(
                updateCurrentUserAsync({
                    formData,
                    cb: (updateduser) => {
                        setShowAlertSuccess(true)
                        setUser({
                            ...user,
                            username: {
                                value: user.username.value,
                                edit: false,
                            },
                        })
                        if (updateduser) dispatch(setAuthUser(updateduser))
                    },
                })
            )
        } else if (type === 'bio') {
            formData.append('bio', inputBio.value)
            dispatch(
                updateCurrentUserAsync({
                    formData,
                    cb: (updateduser) => {
                        setShowAlertSuccess(true)
                        setUser({
                            ...user,
                            bio: { value: user.bio.value, edit: false },
                        })
                        if (updateduser) dispatch(setAuthUser(updateduser))
                    },
                })
            )
        } else if (type === 'phone_no') {
            formData.append(
                'phone_no',
                `+${selectedCountryCode}${inputPhoneNumber.value}`
            )
            dispatch(
                updateCurrentUserAsync({
                    formData,
                    cb: (updateduser) => {
                        setShowAlertSuccess(true)
                        setUser({
                            ...user,
                            phone_no: {
                                value: user.phone_no.value,
                                edit: false,
                            },
                        })
                        if (updateduser) dispatch(setAuthUser(updateduser))
                    },
                })
            )
        } else if (type === 'email') {
            formData.append('email', inputEmail.value)
            dispatch(
                updateCurrentUserAsync({
                    formData,
                    cb: (updateduser) => {
                        setShowAlertSuccess(true)
                        setUser({
                            ...user,
                            email: {
                                value: user.email.value,
                                edit: false,
                            },
                        })
                        if (updateduser) dispatch(setAuthUser(updateduser))
                    },
                })
            )
        }
    }

    //Edit or delete address action handler
    const editOrDeleteAddressActionHandler = (
        address: IAddress,
        action: 'UPDATE' | 'DELETE',
        closeModal?: () => void
    ) => {
        //1) Validate
        if (!user) return

        //2) Find index of this address in user's addressess
        const index = user.addresses.findIndex(
            (addr) => addr._id === address._id
        )

        //3) Define variable to hold the updated addresses
        let updatedAddresses

        //4) If action updated then update/addnew, else delete the address
        if (action === 'UPDATE') {
            //=> If new address set to be default address, remove from default for all other addressess
            updatedAddresses = user.addresses.map((addr) => ({
                ...addr,
                default_shipping_address: address.default_shipping_address
                    ? false
                    : addr.default_shipping_address,
                default_billing_address: address.default_billing_address
                    ? false
                    : addr.default_billing_address,
            }))

            //=> If exist, update, else add new
            if (index !== -1) updatedAddresses[index] = address
            else updatedAddresses.push({ ...address })
        } else {
            updatedAddresses = [...user.addresses]
            updatedAddresses.splice(index, 1)
        }

        //5) Prepare form data with updated addresses
        const formData = new FormData()
        updatedAddresses.map((addr, i) => {
            formData.append(`addresses[${i}]['full_name']`, addr.full_name)
            formData.append(`addresses[${i}]['phone_no']`, addr.phone_no)
            formData.append(`addresses[${i}]['country']`, addr.country)
            formData.append(`addresses[${i}]['state']`, addr.state)
            formData.append(`addresses[${i}]['city']`, addr.city)
            formData.append(`addresses[${i}]['address']`, addr.address)
            formData.append(`addresses[${i}]['zip_code']`, addr.zip_code)
            formData.append(
                `addresses[${i}]['property_type']`,
                addr.property_type
            )
            formData.append(
                `addresses[${i}]['default_billing_address']`,
                JSON.stringify(addr.default_billing_address)
            )
            formData.append(
                `addresses[${i}]['default_shipping_address']`,
                JSON.stringify(addr.default_shipping_address)
            )
        })

        //6) Dispatch action to update current user
        dispatch(
            updateCurrentUserAsync({
                formData,
                cb: (updateduser) => {
                    setShowAlertSuccess(true)
                    updateduser && dispatch(setAuthUser(updateduser))
                    closeModal && closeModal()
                },
            })
        )
    }

    //Delete my review handler
    const deleteMyReviewHandler = (id: string) => {
        setSelectedActionReview(id)
        setShowAlert(false)

        //1) Find review with id
        const review = allReviews.find((review) => review._id === id)

        //2) Validate
        if (!review) return

        //3) if admin user, delete with admin route
        if (user?.role === 'admin') {
            return dispatch(
                deleteReviewAsync({
                    ids: [review._id],
                    cb: () =>
                        setAllReviews((state) =>
                            state.filter((review) => review._id !== id)
                        ),
                })
            )
        }

        //4) else delete with user route
        dispatch(
            deleteUserProductReviewAsync({
                id: review.product?._id,
                cb: () => {
                    setAllReviews((state) =>
                        state.filter((review) => review._id !== id)
                    ),
                        setShowAlert(true)
                },
            })
        )
    }

    //Update my review handler
    const updateMyReviewHandler = (
        id: string,
        formData: GenericFormData,
        closeEditMode: () => void
    ) => {
        //1) Hide alert and set review on which action to be performed
        setShowAlert(false)
        setSelectedActionReview(id)

        //2) Find review with its id, return if not found
        const review = allReviews.find((review) => review._id === id)
        if (!review) return

        //3) if admin user, update with admin route
        if (user?.role === 'admin') {
            return dispatch(
                updateReviewAsync({
                    id: review._id,
                    formData,
                    cb: (updatedReview) => {
                        if (updatedReview)
                            setAllReviews((state) =>
                                state.map((rev) => {
                                    return rev._id === review._id
                                        ? updatedReview
                                        : rev
                                })
                            )
                        setShowAlert(true)
                        closeEditMode()
                    },
                })
            )
        }

        //4) else update with user route
        dispatch(
            updateUserProductReviewAsync({
                id: review.product._id,
                formData,
                cb: (updatedReview) => {
                    if (updatedReview)
                        setAllReviews((state) =>
                            state.map((rev) => {
                                return rev._id === review._id
                                    ? updatedReview
                                    : rev
                            })
                        )
                    closeEditMode()
                },
            })
        )
    }

    //Get orders of by page number
    const getOrders = (page: number, combineResults?: boolean) => {
        //1) Set query params
        const queryParams =
            activeTabOrder === 0
                ? []
                : activeTabOrder === 1
                ? [
                      {
                          key: 'delivery_status',
                          value: 'completed',
                      },
                  ]
                : activeTabOrder === 2
                ? [
                      {
                          key: 'delivery_status',
                          value: 'on_hold',
                      },
                      {
                          key: 'delivery_status',
                          value: 'processing',
                      },
                      {
                          key: 'delivery_status',
                          value: 'pending_payment',
                      },
                  ]
                : [
                      {
                          key: 'delivery_status',
                          value: 'refunded',
                      },
                      {
                          key: 'delivery_status',
                          value: 'canceled',
                      },
                  ]

        //2) Get orders
        dispatch(
            getMyOrdersAsync({
                queryParams: [
                    ...queryParams,
                    { key: 'page', value: page.toString() },
                ],
                cb: (orders) => {
                    combineResults
                        ? setAllOrders((state) => [...state, ...orders])
                        : setAllOrders(orders)
                    setShowAlert(true)
                },
            })
        )
    }

    return (
        <ProfileStyled>
            <Header />
            <Toolbar>
                <Breadcrumbs color="text.secondary">
                    <Link
                        component={RouterLink}
                        to="/"
                        color="inherit"
                        underline="hover"
                    >
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap="4px"
                        >
                            <HomeOutlined /> Home
                        </Stack>
                    </Link>
                    <Typography color="primary">Profile</Typography>
                </Breadcrumbs>
            </Toolbar>
            <Section>
                <Stack alignItems="flex-start" gap="16px">
                    <Typography variant="h4">
                        Hello, {authUser?.name || 'there'}!
                    </Typography>
                    <Typography variant="body1" fontWeight="400">
                        Welcome back to your profile, from here you can manage
                        your account.
                    </Typography>
                </Stack>
                <TabsWrapper>
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
                        {showAlert &&
                        (errors.update ||
                            errors.fetch ||
                            errorsOrder.fetch ||
                            errorsReview.fetch ||
                            errorsReview.update ||
                            errorsReview.delete) ? (
                            <Alert
                                sx={{ textAlign: 'left', margin: '16px' }}
                                severity={'error'}
                                variant="outlined"
                                onClose={() => setShowAlert(false)}
                            >
                                <AlertTitle>Error Occured!</AlertTitle>
                                {errors.fetch ||
                                    errors.update ||
                                    errorsOrder.fetch ||
                                    errorsReview.fetch ||
                                    errorsReview.update ||
                                    errorsReview.delete}
                            </Alert>
                        ) : (
                            showAlertSuccess && (
                                <Alert
                                    sx={{ textAlign: 'left', margin: '16px' }}
                                    severity={'success'}
                                    variant="outlined"
                                    onClose={() => setShowAlertSuccess(false)}
                                >
                                    <AlertTitle>Success!</AlertTitle>
                                    {
                                        'Your profile has been updated successfully.'
                                    }
                                </Alert>
                            )
                        )}
                        <TabPanel value={activeTab} index={0}>
                            <Table
                                sx={{
                                    '& td:nth-child(1)': {
                                        width: '140px',
                                    },
                                    '& tr:last-child td': {
                                        borderBottom: '0',
                                    },
                                }}
                            >
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Typography
                                                variant="subtitle1"
                                                color="GrayText"
                                            >
                                                Profile Photo
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Avatar
                                                sx={{
                                                    width: '64px',
                                                    height: '64px',
                                                    cursor: 'pointer',
                                                }}
                                                component="label"
                                                htmlFor="upload"
                                            >
                                                <PhotoCamera
                                                    sx={{
                                                        position: 'absolute',
                                                    }}
                                                />
                                                <img
                                                    style={{
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                    src={
                                                        inputProfilePhoto.modified
                                                            ? inputProfilePhoto
                                                                  .value
                                                                  .length > 0
                                                                ? inputProfilePhoto
                                                                      .value[0]
                                                                      .url
                                                                : ''
                                                            : user?.photo?.url
                                                    }
                                                    crossOrigin="anonymous"
                                                />
                                                <input
                                                    id="upload"
                                                    hidden
                                                    accept="image/*"
                                                    type="file"
                                                    onChange={
                                                        inputProfilePhoto.onChange
                                                    }
                                                />
                                            </Avatar>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Typography
                                                variant="subtitle1"
                                                color="GrayText"
                                            >
                                                Full Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            {user?.name.edit ? (
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    gap="16px"
                                                    width="100%"
                                                >
                                                    <TextField
                                                        value={inputName.value}
                                                        onChange={
                                                            inputName.onChangeHandler
                                                        }
                                                        onBlur={
                                                            inputName.onBlurHandler
                                                        }
                                                        error={
                                                            inputName.validation
                                                                .error
                                                        }
                                                        helperText={
                                                            inputName.validation
                                                                .message
                                                        }
                                                        fullWidth={true}
                                                    />
                                                    <ButtonGroup
                                                        sx={{ width: '100%' }}
                                                    >
                                                        <Button
                                                            disabled={
                                                                inputName
                                                                    .validation
                                                                    .error ||
                                                                isLoading.update
                                                            }
                                                            onClick={
                                                                clickSaveHandler
                                                            }
                                                            data-type="name"
                                                        >
                                                            {isLoading.update ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                'Save'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            data-type="name"
                                                            onClick={
                                                                clickEditHandler
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </Box>
                                            ) : (
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color="text.secondary"
                                                >
                                                    {user?.name.value}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {!user?.name.edit && (
                                                <IconButton
                                                    onClick={clickEditHandler}
                                                    data-type="name"
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Typography
                                                variant="subtitle1"
                                                color="GrayText"
                                            >
                                                Phone Number
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            {user?.phone_no.edit ? (
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    gap="16px"
                                                    width="100%"
                                                >
                                                    <Stack flexDirection="row">
                                                        <TextField
                                                            label="Country Code"
                                                            value={
                                                                selectedCountryCode
                                                            }
                                                            onChange={(e) =>
                                                                setSelectedCountryCode(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            select
                                                            sx={{
                                                                flex: '0 0 108px !important',
                                                            }}
                                                        >
                                                            <MenuItem value="select">
                                                                Select Code
                                                            </MenuItem>
                                                            {countries.map(
                                                                (country) => (
                                                                    <MenuItem
                                                                        key={
                                                                            country.name
                                                                        }
                                                                        value={
                                                                            country.phone_code
                                                                        }
                                                                    >
                                                                        {country.emoji +
                                                                            ' ' +
                                                                            country.phone_code}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </TextField>
                                                        <TextField
                                                            value={
                                                                inputPhoneNumber.value
                                                            }
                                                            onChange={
                                                                inputPhoneNumber.onChangeHandler
                                                            }
                                                            onBlur={
                                                                inputPhoneNumber.onBlurHandler
                                                            }
                                                            error={
                                                                inputPhoneNumber
                                                                    .validation
                                                                    .error
                                                            }
                                                            helperText={
                                                                inputPhoneNumber
                                                                    .validation
                                                                    .message
                                                            }
                                                            fullWidth={true}
                                                        />
                                                    </Stack>
                                                    <ButtonGroup
                                                        sx={{ width: '100%' }}
                                                    >
                                                        <Button
                                                            onClick={
                                                                clickSaveHandler
                                                            }
                                                            disabled={
                                                                inputPhoneNumber
                                                                    .validation
                                                                    .error ||
                                                                isLoading.update
                                                            }
                                                            data-type="phone_no"
                                                        >
                                                            {isLoading.update ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                'Save'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            data-type="phone_no"
                                                            onClick={
                                                                clickEditHandler
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </Box>
                                            ) : (
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color="text.secondary"
                                                >
                                                    {user?.phone_no.value}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {!user?.phone_no.edit && (
                                                <IconButton
                                                    onClick={clickEditHandler}
                                                    data-type="phone_no"
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">Bio</TableCell>
                                        <TableCell align="left">
                                            {user?.bio.edit ? (
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    gap="16px"
                                                    width="100%"
                                                >
                                                    <TextField
                                                        value={inputBio.value}
                                                        onChange={
                                                            inputBio.onChangeHandler
                                                        }
                                                        onBlur={
                                                            inputBio.onBlurHandler
                                                        }
                                                        error={
                                                            inputBio.validation
                                                                .error
                                                        }
                                                        helperText={
                                                            inputBio.validation
                                                                .message
                                                        }
                                                        fullWidth={true}
                                                        multiline={true}
                                                        rows="4"
                                                    />
                                                    <ButtonGroup
                                                        sx={{ width: '100%' }}
                                                    >
                                                        <Button
                                                            onClick={
                                                                clickSaveHandler
                                                            }
                                                            disabled={
                                                                inputBio
                                                                    .validation
                                                                    .error ||
                                                                isLoading.update
                                                            }
                                                            data-type="bio"
                                                        >
                                                            {isLoading.update ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                'Save'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            data-type="bio"
                                                            onClick={
                                                                clickEditHandler
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </Box>
                                            ) : (
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color="text.secondary"
                                                >
                                                    {user?.bio.value}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {!user?.bio.edit && (
                                                <IconButton
                                                    onClick={clickEditHandler}
                                                    data-type="bio"
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TabPanel>
                        <TabPanel value={activeTab} index={1}>
                            <Table
                                sx={{
                                    '& td:nth-child(1)': {
                                        width: '140px',
                                    },
                                    '& tr:last-child td': {
                                        borderBottom: '0',
                                    },
                                }}
                            >
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Typography
                                                variant="subtitle1"
                                                color="GrayText"
                                            >
                                                Username
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            {user?.username.edit ? (
                                                <Stack gap="16px">
                                                    <TextField
                                                        value={
                                                            inputUsername.value
                                                        }
                                                        onChange={
                                                            inputUsername.onChangeHandler
                                                        }
                                                        onBlur={
                                                            inputUsername.onBlurHandler
                                                        }
                                                        error={
                                                            inputUsername
                                                                .validation
                                                                .error
                                                        }
                                                        helperText={
                                                            inputUsername
                                                                .validation
                                                                .message
                                                        }
                                                        fullWidth={true}
                                                    />
                                                    <ButtonGroup
                                                        sx={{ width: '100%' }}
                                                    >
                                                        <Button
                                                            onClick={
                                                                clickSaveHandler
                                                            }
                                                            disabled={
                                                                inputUsername
                                                                    .validation
                                                                    .error ||
                                                                isLoading.update
                                                            }
                                                            data-type="username"
                                                        >
                                                            {isLoading.update ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                'Save'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            data-type="username"
                                                            onClick={
                                                                clickEditHandler
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </Stack>
                                            ) : (
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color="text.secondary"
                                                >
                                                    {user?.username.value}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {!user?.username.edit && (
                                                <IconButton
                                                    onClick={clickEditHandler}
                                                    data-type="username"
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Typography
                                                variant="subtitle1"
                                                color="GrayText"
                                            >
                                                Email
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            {user?.email.edit ? (
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    gap="16px"
                                                    width="100%"
                                                >
                                                    <TextField
                                                        value={inputEmail.value}
                                                        onChange={
                                                            inputEmail.onChangeHandler
                                                        }
                                                        onBlur={
                                                            inputEmail.onBlurHandler
                                                        }
                                                        error={
                                                            inputEmail
                                                                .validation
                                                                .error
                                                        }
                                                        helperText={
                                                            inputEmail
                                                                .validation
                                                                .message
                                                        }
                                                        fullWidth={true}
                                                    />
                                                    <ButtonGroup
                                                        sx={{ width: '100%' }}
                                                    >
                                                        <Button
                                                            onClick={
                                                                clickSaveHandler
                                                            }
                                                            disabled={
                                                                inputEmail
                                                                    .validation
                                                                    .error ||
                                                                isLoading.update
                                                            }
                                                            data-type="email"
                                                        >
                                                            {isLoading.update ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                'Save'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            data-type="email"
                                                            onClick={
                                                                clickEditHandler
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </Box>
                                            ) : (
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color="text.secondary"
                                                >
                                                    {user?.email.value}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {!user?.email.edit && (
                                                <IconButton
                                                    onClick={clickEditHandler}
                                                    data-type="email"
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">
                                            <Typography
                                                variant="subtitle1"
                                                color="GrayText"
                                            >
                                                Password
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            {user?.password.edit ? (
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    gap="16px"
                                                    width="100%"
                                                >
                                                    <TextField
                                                        label="Password"
                                                        value={
                                                            inputCurrPassword.value
                                                        }
                                                        onChange={
                                                            inputCurrPassword.onChangeHandler
                                                        }
                                                        onBlur={
                                                            inputCurrPassword.onBlurHandler
                                                        }
                                                        error={
                                                            inputCurrPassword
                                                                .validation
                                                                .error
                                                        }
                                                        helperText={
                                                            inputCurrPassword
                                                                .validation
                                                                .message
                                                        }
                                                        type="password"
                                                        fullWidth={true}
                                                    />
                                                    <TextField
                                                        label="New Password"
                                                        value={
                                                            inputPassword.value
                                                        }
                                                        onChange={
                                                            inputPassword.onChangeHandler
                                                        }
                                                        onBlur={
                                                            inputPassword.onBlurHandler
                                                        }
                                                        error={
                                                            inputPassword
                                                                .validation
                                                                .error
                                                        }
                                                        helperText={
                                                            inputPassword
                                                                .validation
                                                                .message
                                                        }
                                                        type="password"
                                                        fullWidth={true}
                                                    />
                                                    <TextField
                                                        label="Confirm Your Password"
                                                        value={
                                                            inputPasswordConfirm.value
                                                        }
                                                        onChange={
                                                            inputPasswordConfirm.onChangeHandler
                                                        }
                                                        onBlur={
                                                            inputPasswordConfirm.onBlurHandler
                                                        }
                                                        error={
                                                            inputPasswordConfirm
                                                                .validation
                                                                .error
                                                        }
                                                        helperText={
                                                            inputPasswordConfirm
                                                                .validation
                                                                .message
                                                        }
                                                        type="password"
                                                        fullWidth={true}
                                                    />
                                                    <ButtonGroup
                                                        sx={{ width: '100%' }}
                                                    >
                                                        <Button
                                                            onClick={
                                                                clickSaveHandler
                                                            }
                                                            disabled={
                                                                inputCurrPassword
                                                                    .validation
                                                                    .error ||
                                                                !inputCurrPassword
                                                                    .validation
                                                                    .touched ||
                                                                inputPassword
                                                                    .validation
                                                                    .error ||
                                                                !inputPassword
                                                                    .validation
                                                                    .touched ||
                                                                inputPasswordConfirm
                                                                    .validation
                                                                    .error ||
                                                                !inputPasswordConfirm
                                                                    .validation
                                                                    .touched ||
                                                                isLoading.update
                                                            }
                                                            data-type="password"
                                                        >
                                                            {isLoading.update ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                'Save'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            data-type="password"
                                                            onClick={
                                                                clickEditHandler
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </Box>
                                            ) : (
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color="text.secondary"
                                                >
                                                    {user?.password.value}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {!user?.password.edit && (
                                                <IconButton
                                                    onClick={clickEditHandler}
                                                    data-type="password"
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TabPanel>
                        <TabPanel value={activeTab} index={2}>
                            <Stack gap="16px">
                                <Box alignSelf="flex-end">
                                    <AddressView
                                        isLoading={isLoading.update}
                                        onSave={(address, closeModal) =>
                                            editOrDeleteAddressActionHandler(
                                                address,
                                                'UPDATE',
                                                closeModal
                                            )
                                        }
                                        mode="ADD_NEW"
                                    />
                                </Box>
                                {user?.addresses.map((addr) => {
                                    const addrUpd = {
                                        ...addr,
                                        property_type: addr.property_type as
                                            | 'house'
                                            | 'apartment'
                                            | 'business'
                                            | 'other',
                                    }
                                    return (
                                        <AddressView
                                            key={addr._id}
                                            address={addrUpd}
                                            mode="EDIT"
                                            isLoading={
                                                isLoading.update ||
                                                isLoading.delete
                                            }
                                            onSave={(address, closeModal) =>
                                                editOrDeleteAddressActionHandler(
                                                    address,
                                                    'UPDATE',
                                                    closeModal
                                                )
                                            }
                                            onDelete={(address) =>
                                                editOrDeleteAddressActionHandler(
                                                    address,
                                                    'DELETE'
                                                )
                                            }
                                        />
                                    )
                                })}
                            </Stack>
                        </TabPanel>
                        <TabPanel value={activeTab} index={3}>
                            <Box
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    color: 'grey',
                                }}
                            >
                                <Tabs
                                    textColor="inherit"
                                    variant="scrollable"
                                    value={activeTabOrder}
                                    onChange={(e, val) =>
                                        setActiveTabOrder(val)
                                    }
                                    aria-label="order tabs"
                                >
                                    <Tab label="All" />
                                    <Tab label="Delivered" />
                                    <Tab label="Not Yet Shipped" />
                                    <Tab label="Canceled" />
                                </Tabs>
                            </Box>
                            {[...new Array(4)].map((_, i) => (
                                <TabPanel
                                    value={activeTabOrder}
                                    index={i}
                                    key={i}
                                >
                                    {isLoadingOrder.fetch && pageOrder === 1 ? (
                                        <CircularProgress />
                                    ) : (
                                        <Stack gap="32px">
                                            {allOrders.length <= 0 ? (
                                                <Typography>
                                                    Uh oh! No orders found.
                                                </Typography>
                                            ) : (
                                                <>
                                                    <Typography variant="caption">
                                                        Showing{' '}
                                                        {allOrders.length} of{' '}
                                                        {countOrder} orders.
                                                    </Typography>
                                                    {allOrders.map((order) => (
                                                        <Order {...order} />
                                                    ))}
                                                    {allOrders.length <
                                                        countOrder && (
                                                        <Box>
                                                            <Button
                                                                disabled={
                                                                    isLoadingOrder.fetch
                                                                }
                                                                onClick={() => {
                                                                    setPageOrder(
                                                                        (
                                                                            state
                                                                        ) => {
                                                                            getOrders(
                                                                                state +
                                                                                    1,
                                                                                true
                                                                            )

                                                                            return (
                                                                                state +
                                                                                1
                                                                            )
                                                                        }
                                                                    )
                                                                }}
                                                                variant="outlined"
                                                            >
                                                                {isLoadingOrder.fetch ? (
                                                                    <CircularProgress
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ) : (
                                                                    'Show more'
                                                                )}
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </>
                                            )}
                                        </Stack>
                                    )}
                                </TabPanel>
                            ))}
                        </TabPanel>
                        <TabPanel value={activeTab} index={4}>
                            <Stack gap="16px" textAlign="left">
                                <Typography variant="caption">
                                    Showing {allReviews.length} of{' '}
                                    {countReviews} reviews.
                                </Typography>
                                {allReviews.map((review) => (
                                    <Stack
                                        key={review._id}
                                        sx={{
                                            textAlign: 'left',
                                            border: `1px solid ${theme.palette.grey[300]}`,
                                        }}
                                        gap="16px"
                                    >
                                        <Typography
                                            color="GrayText"
                                            sx={{ padding: '16px 16px 0 16px' }}
                                        >
                                            You reviewed{' '}
                                            <Link
                                                component={RouterLink}
                                                to={`/product/${review.product?._id}`}
                                            >
                                                {review.product?.title}
                                            </Link>{' '}
                                            on{' '}
                                            {new Date(
                                                review.created_at
                                            ).toDateString()}
                                        </Typography>
                                        <Divider />
                                        <Review
                                            review={review}
                                            isLoading={
                                                (isLoadingReview.delete ||
                                                    isLoadingReview.update) &&
                                                selectedActionReview ===
                                                    review._id
                                            }
                                            onSave={(formData, closeModal) =>
                                                updateMyReviewHandler(
                                                    review._id,
                                                    formData,
                                                    closeModal
                                                )
                                            }
                                            onDelete={() =>
                                                deleteMyReviewHandler(
                                                    review._id
                                                )
                                            }
                                        />
                                    </Stack>
                                ))}
                                {allReviews.length < countReviews && (
                                    <Box sx={{ alignSelf: 'center' }}>
                                        <Button
                                            disabled={isLoadingReview.fetch}
                                            variant="outlined"
                                            onClick={() => {
                                                ranFetchReview.current = false
                                                setPageReview(
                                                    (state) => state + 1
                                                )
                                            }}
                                        >
                                            {isLoadingReview.fetch ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                'Show more'
                                            )}
                                        </Button>
                                    </Box>
                                )}
                            </Stack>
                        </TabPanel>
                    </Stack>
                </TabsWrapper>
            </Section>
            <Footer />
        </ProfileStyled>
    )
}

export default Profile
