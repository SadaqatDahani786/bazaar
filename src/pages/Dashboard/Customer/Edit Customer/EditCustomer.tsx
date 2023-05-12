import { useEffect, useRef, useState } from 'react'

import {
    EmailOutlined,
    LockOutlined,
    PersonOutline,
    PhotoCamera,
    SmartphoneOutlined,
} from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material'

import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'

//Redux
import { getCountriesAsync } from '../../../../store/locationReducer'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import {
    getUserAsync,
    IUserDatabase,
    updateUserAsync,
} from '../../../../store/userReducer'

//Components
import AddressView from '../../../../components/AddressView'

//Hooks & Func
import useInput from '../../../../hooks/useInput'
import useUpload from '../../../../hooks/useUpload'
import {
    combineValidators,
    isEmpty,
    isAlpha,
    isMaxLength,
    isAlphaNumeric,
    isEmail,
    isPassMissmatched,
    isPassStrong,
    isPhoneNumber,
} from '../../../../utils/validators'
import { splitNumberByCode } from '../../../../utils/splitNumberByCode'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Edit Customer
const EditCustomerStyled = styled.div`
    width: 100%;
    padding: 32px 0;
`

//Widget
const Widget = styled.div`
    border: 1px solid ${(props) => props.theme.palette.grey['500']};
    padding: 16px;

    &:nth-child(1) {
        border-bottom: none;
    }
`

//Heading
const Heading = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 24px 0;
`

//Form Group
const FormGroup = styled.div`
    width: 100%;
    display: flex;
    gap: 16px;

    & > * {
        flex: 1;
    }
`

//Form Wrapper
const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 0;
`

const EditCustomer = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const [params] = useSearchParams()

    const isLoadingUser = useAppSelector((state) => state.user.isLoading)
    const errorsUser = useAppSelector((state) => state.user.errors)
    const users = useAppSelector((state) => state.user.data)

    const [user, setUser] = useState<IUserDatabase>()
    const [showAlert, setShowAlert] = useState(false)

    const countries = useAppSelector((state) => state.location.data)
    const dispatch = useAppDispatch()

    const [isAdmin, setIsAdmin] = useState(false)
    const [selectedCountryCode, setSelectedCountryCode] = useState('select')

    //Refs
    const refInputName = useRef<HTMLInputElement>(null)
    const refInputCountryCode = useRef<HTMLInputElement>(null)
    const refCountryCode = useRef<HTMLDivElement>(null)
    const refInputPhoneNo = useRef<HTMLInputElement>(null)
    const refInputBio = useRef<HTMLInputElement>(null)

    const refInputUsername = useRef<HTMLInputElement>(null)
    const refInputEmail = useRef<HTMLInputElement>(null)
    const refInputPassword = useRef<HTMLInputElement>(null)
    const refInputConfirmPassword = useRef<HTMLInputElement>(null)

    const refAlert = useRef<HTMLDivElement>(null)

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch countries
    useEffect(() => {
        if (countries.length > 0) {
            setSelectedCountryCode(
                splitNumberByCode(user?.phone_no).country_code.substring(1)
            )
            return
        }
        dispatch(getCountriesAsync())
    }, [])

    //Set country code
    useEffect(() => {
        setSelectedCountryCode(
            splitNumberByCode(user?.phone_no).country_code.substring(1)
        )
    }, [countries])

    //Fetch user which to be updated
    useEffect(() => {
        //1) Get id and index
        const id = params.get('id')
        const ind = users.findIndex((user) => user._id === id)

        //2) Validate
        if (!id) return

        //3) Set user
        if (ind === -1)
            dispatch(
                getUserAsync({
                    id: id,
                    cb: (user) => {
                        setUser(user)
                        setIsAdmin(user.role === 'admin')
                    },
                })
            )
        else {
            setUser(users[ind])
            setIsAdmin(users[ind].role === 'admin')
        }
    }, [])

    //Scroll alert into the view
    useEffect(() => {
        //=> Scroll to the alert when it's to show up
        if (!showAlert) return
        refAlert.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })

        //=> Reset inputs on succesful request
        if (!errorsUser.create) clickResetHandler()
    }, [showAlert])

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Photo
    const inputProfilePhoto = useUpload({})

    //Name
    const inputName = useInput({
        default_value: user?.name || '',
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
        default_value: splitNumberByCode(user?.phone_no).number,
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
        default_value: user?.bio || '',
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
        default_value: user?.username || '',
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
        default_value: user?.email || '',
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

    //Click update handler
    const clickUpdateHandler = () => {
        if (!user) return

        //1) Hide alert before new request
        setShowAlert(false)

        //2) Define scroll options
        const scrollOptions: ScrollIntoViewOptions = {
            behavior: 'smooth',
            block: 'end',
        }

        //3) Trigger validation of ipnuts
        inputName.validation.validate()
        inputPhoneNumber.validation.validate()
        inputBio.validation.validate()
        inputUsername.validation.validate()
        inputEmail.validation.validate()
        inputPassword.validation.validate()
        inputPasswordConfirm.validation.validate()

        //4) Focus on invalid fiedls
        if (inputName.validation.error || !inputName.validation.touched) {
            refInputName.current?.focus()
            return refInputName.current?.scrollIntoView(scrollOptions)
        } else if (
            selectedCountryCode === 'select' ||
            selectedCountryCode === ''
        ) {
            refInputCountryCode.current?.focus()
            return refCountryCode.current?.scrollIntoView(scrollOptions)
        } else if (
            inputPhoneNumber.validation.error ||
            !inputPhoneNumber.validation.touched
        ) {
            refInputPhoneNo.current?.focus()
            return refInputPhoneNo.current?.scrollIntoView(scrollOptions)
        } else if (inputBio.validation.error || !inputBio.validation.touched) {
            refInputBio.current?.focus()
            return refInputBio.current?.scrollIntoView(scrollOptions)
        } else if (
            inputUsername.validation.error ||
            !inputUsername.validation.touched
        ) {
            refInputUsername.current?.focus()
            return refInputUsername.current?.scrollIntoView(scrollOptions)
        } else if (
            inputEmail.validation.error ||
            !inputEmail.validation.touched
        ) {
            refInputEmail.current?.focus()
            return refInputEmail.current?.scrollIntoView(scrollOptions)
        } else if (
            inputPassword.validation.error ||
            !inputPassword.validation.touched
        ) {
            refInputPassword.current?.focus()
            return refInputPassword.current?.scrollIntoView(scrollOptions)
        } else if (
            inputPasswordConfirm.validation.error ||
            !inputPasswordConfirm.validation.touched
        ) {
            refInputConfirmPassword.current?.focus()
            return refInputConfirmPassword.current?.scrollIntoView(
                scrollOptions
            )
        }

        //5) No error, proceed with creating form data for update
        const formData = new FormData()

        //=> Personal
        formData.append('name', inputName.value)
        formData.append(
            'phone_no',
            '+' + selectedCountryCode + inputPhoneNumber.value
        )
        formData.append('bio', inputBio.value)

        if (inputProfilePhoto.value.length > 0)
            formData.append('photo', inputProfilePhoto.value[0].file as File)

        //=> Account
        formData.append('username', inputUsername.value)
        formData.append('email', inputEmail.value)
        formData.append('role', isAdmin ? 'admin' : 'member')
        formData.append('password', inputPassword.value)
        formData.append('password_confirm', inputPasswordConfirm.value)

        //=> Addresses
        user.addresses.map((addr, i) => {
            formData.append(`addresses[${i}][full_name]`, addr.full_name)
            formData.append(`addresses[${i}][phone_no]`, addr.phone_no)
            formData.append(`addresses[${i}][address]`, addr.address)
            formData.append(`addresses[${i}][zip_code]`, addr.zip_code)
            formData.append(`addresses[${i}][country]`, addr.country)
            formData.append(`addresses[${i}][state]`, addr.state)
            formData.append(`addresses[${i}][city]`, addr.city)
            formData.append(
                `addresses[${i}][property_type]`,
                addr.property_type
            )
            formData.append(
                `addresses[${i}][default_billing_address]`,
                addr.default_billing_address.toString()
            )
            formData.append(
                `addresses[${i}][default_shipping_address]`,
                addr.default_shipping_address.toString()
            )
        })

        //6) Dispatch update action
        dispatch(
            updateUserAsync({
                id: user._id,
                formData,
                cb: () => setShowAlert(true),
            })
        )
    }

    //Click reset handler
    const clickResetHandler = () => {
        inputName.reset(true)
        inputPhoneNumber.reset(true)
        inputBio.reset(true)
        inputUsername.reset(true)
        inputEmail.reset(true)
        inputPassword.reset(false)
        inputPasswordConfirm.reset(false)
        inputProfilePhoto.reset()
        setSelectedCountryCode(
            splitNumberByCode(user?.phone_no).country_code.substring(1)
        )
        setIsAdmin(user?.role === 'admin')
    }

    return (
        <EditCustomerStyled>
            {showAlert && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: '16px',
                        paddingBottom: '40px',
                    }}
                >
                    <Alert
                        sx={{ width: '100%', textAlign: 'left' }}
                        onClose={() => setShowAlert(false)}
                        variant="outlined"
                        ref={refAlert}
                        severity={errorsUser.update ? 'error' : 'success'}
                    >
                        <AlertTitle>
                            {errorsUser.update ? 'Error Occured' : 'Succesful'}!
                        </AlertTitle>
                        {errorsUser.update
                            ? errorsUser.update
                            : 'Customer has been updated successfully!'}
                    </Alert>
                </Box>
            )}
            <Widget>
                <Heading>
                    <Typography variant="h5">Personal Information</Typography>
                </Heading>
                <FormWrapper>
                    <FormGroup>
                        <TextField
                            label="Full Name"
                            error={inputName.validation.error}
                            helperText={inputName.validation.message}
                            onChange={inputName.onChangeHandler}
                            onBlur={inputName.onBlurHandler}
                            value={inputName.value}
                            fullWidth={true}
                            inputRef={refInputName}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutline />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Country Code"
                            value={selectedCountryCode}
                            onChange={(e) => {
                                setSelectedCountryCode(e.target.value)
                            }}
                            select
                            sx={{ flex: '0 0 108px !important' }}
                            inputRef={refInputCountryCode}
                            ref={refCountryCode}
                        >
                            <MenuItem disabled={true} value="select">
                                Select
                            </MenuItem>
                            {countries.map((country) => (
                                <MenuItem
                                    key={country.name}
                                    value={country.phone_code}
                                >
                                    {country.emoji + ' ' + country.phone_code}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Phone Number"
                            value={inputPhoneNumber.value}
                            onChange={inputPhoneNumber.onChangeHandler}
                            onBlur={inputPhoneNumber.onBlurHandler}
                            error={inputPhoneNumber.validation.error}
                            helperText={inputPhoneNumber.validation.message}
                            fullWidth={true}
                            inputRef={refInputPhoneNo}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SmartphoneOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Write something about yourself"
                            value={inputBio.value}
                            onChange={inputBio.onChangeHandler}
                            onBlur={inputBio.onBlurHandler}
                            error={inputBio.validation.error}
                            helperText={inputBio.validation.message}
                            fullWidth={true}
                            multiline={true}
                            rows="4"
                            inputRef={refInputBio}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Box>
                            <Avatar
                                sx={{
                                    width: '64px',
                                    height: '64px',
                                    cursor: 'pointer',
                                }}
                                component="label"
                                htmlFor="upload"
                            >
                                <PhotoCamera sx={{ position: 'absolute' }} />
                                <img
                                    style={{
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                    src={
                                        inputProfilePhoto.value.length <= 0
                                            ? user?.photo.url
                                            : inputProfilePhoto.value[0].url
                                    }
                                    crossOrigin="anonymous"
                                />
                                <input
                                    id="upload"
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={inputProfilePhoto.onChange}
                                    onBlur={inputProfilePhoto.onBlur}
                                />
                            </Avatar>
                        </Box>
                    </FormGroup>
                </FormWrapper>
            </Widget>
            <Widget>
                <Heading>
                    <Typography variant="h5">Account Information</Typography>
                </Heading>
                <FormWrapper>
                    <FormGroup>
                        <TextField
                            label="Username"
                            value={inputUsername.value}
                            onChange={inputUsername.onChangeHandler}
                            onBlur={inputUsername.onBlurHandler}
                            error={inputUsername.validation.error}
                            helperText={inputUsername.validation.message}
                            fullWidth={true}
                            inputRef={refInputUsername}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutline />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControlLabel
                            label="Is Admin?"
                            control={
                                <Checkbox
                                    checked={isAdmin}
                                    onChange={() =>
                                        setIsAdmin((state) => !state)
                                    }
                                />
                            }
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Email"
                            value={inputEmail.value}
                            onChange={inputEmail.onChangeHandler}
                            onBlur={inputEmail.onBlurHandler}
                            error={inputEmail.validation.error}
                            helperText={inputEmail.validation.message}
                            fullWidth={true}
                            type="email"
                            inputRef={refInputEmail}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Password"
                            type="password"
                            value={inputPassword.value}
                            onChange={inputPassword.onChangeHandler}
                            onBlur={inputPassword.onBlurHandler}
                            error={inputPassword.validation.error}
                            helperText={inputPassword.validation.message}
                            fullWidth={true}
                            inputRef={refInputPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Password Confirm"
                            type="password"
                            value={inputPasswordConfirm.value}
                            onChange={inputPasswordConfirm.onChangeHandler}
                            onBlur={inputPasswordConfirm.onBlurHandler}
                            error={inputPasswordConfirm.validation.error}
                            helperText={inputPasswordConfirm.validation.message}
                            fullWidth={true}
                            inputRef={refInputConfirmPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormGroup>
                </FormWrapper>
                <FormGroup></FormGroup>
            </Widget>
            <Widget>
                <Heading>
                    <Typography variant="h5">Addresses</Typography>
                    <Box>
                        <AddressView
                            mode="ADD_NEW"
                            onSave={(newAddress, closeModal) => {
                                //1) Validate
                                if (!user) return

                                //2) Add new address and remove default address if new address has it
                                const updUser: IUserDatabase = {
                                    ...user,
                                    addresses: [
                                        ...user.addresses.map((addr) => ({
                                            ...addr,
                                            default_shipping_address:
                                                newAddress.default_shipping_address
                                                    ? false
                                                    : addr.default_shipping_address,
                                            default_billing_address:
                                                newAddress.default_billing_address
                                                    ? false
                                                    : addr.default_billing_address,
                                        })),
                                        newAddress,
                                    ],
                                }

                                //3) Update state
                                setUser(updUser)

                                //4) Close modal
                                closeModal()
                            }}
                        />
                    </Box>
                </Heading>
                <FormWrapper>
                    <FormGroup>
                        <Stack gap="24px">
                            {user?.addresses.map((address, i) => (
                                <AddressView
                                    key={i}
                                    address={address}
                                    mode="EDIT"
                                    onSave={(newAddress, closeModal) => {
                                        //1) Validate
                                        if (!user) return

                                        //2) Update address and remove default address if new address has it
                                        const updUser: IUserDatabase = {
                                            ...user,
                                            addresses: [
                                                ...user.addresses.map(
                                                    (addr, ind) => {
                                                        if (i === ind)
                                                            return {
                                                                ...newAddress,
                                                            }
                                                        return {
                                                            ...address,
                                                            default_shipping_address:
                                                                newAddress.default_shipping_address
                                                                    ? false
                                                                    : addr.default_shipping_address,
                                                            default_billing_address:
                                                                newAddress.default_billing_address
                                                                    ? false
                                                                    : addr.default_billing_address,
                                                        }
                                                    }
                                                ),
                                            ],
                                        }

                                        //3) Update state
                                        setUser(updUser)

                                        //4) Close modal
                                        closeModal()
                                    }}
                                />
                            ))}
                        </Stack>
                    </FormGroup>
                </FormWrapper>
            </Widget>
            <Stack
                flexDirection="row"
                justifyContent="flex-start"
                gap="16px"
                sx={{ padding: '32px 0' }}
            >
                <Button
                    size="large"
                    variant="contained"
                    disableElevation={true}
                    onClick={clickUpdateHandler}
                    disabled={isLoadingUser.update}
                >
                    {isLoadingUser.update ? <CircularProgress /> : 'Update'}
                </Button>
                <Button
                    size="large"
                    variant="outlined"
                    onClick={clickResetHandler}
                >
                    Reset
                </Button>
            </Stack>
        </EditCustomerStyled>
    )
}

export default EditCustomer
