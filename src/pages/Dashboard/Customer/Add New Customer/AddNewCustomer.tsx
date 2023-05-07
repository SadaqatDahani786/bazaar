import { useEffect, useRef, useState } from 'react'

import {
    EmailOutlined,
    LocationOnOutlined,
    LockOutlined,
    PersonOutline,
} from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import {
    getCitiesInStateAsync,
    getCountriesAsync,
    getStatesInCountryAsync,
} from '../../../../store/locationReducer'
import { createUserAsync } from '../../../../store/userReducer'

//Hooks & Func
import useInput from '../../../../hooks/useInput'
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
    isZipCode,
} from '../../../../utils/validators'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Add New Customer
const AddNewCustomerStyled = styled.div`
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
    text-align: left;
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

/**
 ** ======================================================
 ** Component [AddNewCustomer]
 ** ======================================================
 */
const AddNewCustomer = () => {
    /*
     ** **
     ** ** ** State
     ** **
     */
    const isLoadingUser = useAppSelector((state) => state.user.isLoading)
    const errorsUser = useAppSelector((state) => state.user.errors)
    const countries = useAppSelector((state) => state.location.data)
    const dispatch = useAppDispatch()

    const [selectedCountryCode, setSelectedCountryCode] = useState('select')
    const [selectedCountry, setSelectedCountry] = useState('select')
    const [selectedState, setSelectedState] = useState('select')
    const [selectedCity, setSelectedCity] = useState('select')
    const [isAdmin, setIsAdmin] = useState(false)

    const [showAlert, setShowAlert] = useState(false)

    //Refs
    const refInputName = useRef<HTMLInputElement>(null)

    const refInputCountryCode = useRef<HTMLInputElement>(null)
    const refCountryCode = useRef<HTMLDivElement>(null)

    const refInputCountry = useRef<HTMLInputElement>(null)
    const refCountry = useRef<HTMLDivElement>(null)

    const refInputState = useRef<HTMLInputElement>(null)
    const refState = useRef<HTMLDivElement>(null)

    const refInputCity = useRef<HTMLInputElement>(null)
    const refCity = useRef<HTMLDivElement>(null)

    const refInputPhonoNo = useRef<HTMLInputElement>(null)
    const refInputZipCode = useRef<HTMLInputElement>(null)
    const refInputAddress = useRef<HTMLInputElement>(null)
    const refInputBio = useRef<HTMLInputElement>(null)
    const refInputUsername = useRef<HTMLInputElement>(null)
    const refInputEmail = useRef<HTMLInputElement>(null)
    const refInputPassword = useRef<HTMLInputElement>(null)
    const refInputConfirmPassword = useRef<HTMLInputElement>(null)

    const refAlert = useRef<HTMLDivElement>(null)

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Name
    const inputName = useInput({
        default_value: '',
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
        default_value: '',
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

    //Zip code
    const inputZipCode = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isZipCode,
                message: 'Please provide a valid zip code.',
            },
        ]),
    })

    //Address
    const inputAddress = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Where do you live?',
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

    //Bio
    const inputBio = useInput({
        default_value: '',
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
        default_value: '',
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
        default_value: '',
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

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch all countries when components loads first time
    useEffect(() => {
        dispatch(getCountriesAsync())
    }, [])

    //Refetch states when country selection changes
    useEffect(() => {
        if (selectedCountry === 'select') return

        dispatch(getStatesInCountryAsync({ country: selectedCountry }))
    }, [selectedCountry])

    //Refetch cities when state selection changes
    useEffect(() => {
        if (selectedCountry === 'select' || selectedState === 'select') return

        dispatch(
            getCitiesInStateAsync({
                country: selectedCountry,
                state: selectedState,
            })
        )
    }, [selectedState])

    //Scroll alert into the view
    useEffect(() => {
        //=> Scroll to the alert when it's to show up
        if (!showAlert) return
        refAlert.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })

        //=> Reset inputs on succesful request
        if (!errorsUser.create) resetAllInputsHandler()
    }, [showAlert])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //checks if selected country has any states
    const isCountryHasStates = () => {
        //1) Get selected country
        const selCountry = countries.find(
            (country) => country.name === selectedCountry
        )
        if (!selCountry) return false

        //3) Return true if selected country has any state
        return selCountry.states.length > 0
    }

    //Checks if selected state has any cities
    const isStateHasCities = () => {
        //1) Get selected country
        const selCountry = countries.find(
            (country) => country.name === selectedCountry
        )
        if (!selCountry) return false

        //2) Get selected state
        const selState = selCountry.states.find(
            (state) => state.name === selectedState
        )
        if (!selState) return false

        //3) Return true if selected state has any city
        return selState.cities.length > 0
    }

    //Resets inputs
    const resetAllInputsHandler = () => {
        inputName.reset(false)
        inputPhoneNumber.reset(false)
        inputZipCode.reset(false)
        inputAddress.reset(false)
        inputBio.reset(false)
        inputUsername.reset(false)
        inputEmail.reset(false)
        inputPassword.reset(false)
        inputPasswordConfirm.reset(false)

        setSelectedCountryCode('select')
        setSelectedCountry('select')
        setSelectedState('select')
        setSelectedCity('select')
        setIsAdmin(false)
    }

    //Click create customer handler
    const clickCreateCustomerHandler = () => {
        //1) Hide alert before new request
        setShowAlert(false)

        //2) Define scroll behaviour options
        const scrollOptions: ScrollIntoViewOptions = {
            behavior: 'smooth',
            block: 'end',
        }

        //3) Trigger input field validations
        inputName.validation.validate()
        inputPhoneNumber.validation.validate()
        inputZipCode.validation.validate()
        inputAddress.validation.validate()
        inputBio.validation.validate()
        inputUsername.validation.validate()
        inputEmail.validation.validate()
        inputPassword.validation.validate()
        inputPasswordConfirm.validation.validate()

        //4) Focus and scroll into view to the invalid input field
        if (inputName.validation.error || !inputName.validation.touched) {
            refInputName.current?.focus()
            return refInputName.current?.scrollIntoView(scrollOptions)
        } else if (selectedCountryCode === 'select') {
            refInputCountryCode.current?.focus()
            return refCountryCode.current?.scrollIntoView(scrollOptions)
        } else if (
            inputPhoneNumber.validation.error ||
            !inputPhoneNumber.validation.touched
        ) {
            refInputPhonoNo.current?.focus()
            return refInputPhonoNo.current?.scrollIntoView(scrollOptions)
        } else if (
            inputZipCode.validation.error ||
            !inputZipCode.validation.touched
        ) {
            refInputZipCode.current?.focus()
            return refInputZipCode.current?.scrollIntoView(scrollOptions)
        } else if (
            inputAddress.validation.error ||
            !inputAddress.validation.touched
        ) {
            refInputAddress.current?.focus()
            return refInputAddress.current?.scrollIntoView(scrollOptions)
        } else if (selectedCountry === 'select') {
            refInputCountry.current?.focus()
            return refCountry.current?.scrollIntoView(scrollOptions)
        } else if (isCountryHasStates() && selectedState === 'select') {
            refInputState.current?.focus()
            return refState.current?.scrollIntoView(scrollOptions)
        } else if (isStateHasCities() && selectedCity === 'select') {
            refInputCity.current?.focus()
            return refCity.current?.scrollIntoView(scrollOptions)
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

        //5) Create form data
        const formData = new FormData()

        formData.append('name', inputName.value)
        formData.append('email', inputEmail.value)
        formData.append('username', inputUsername.value)
        formData.append('bio', inputBio.value)
        formData.append('password', inputPassword.value)
        formData.append('password_confirm', inputPasswordConfirm.value)
        formData.append('role', isAdmin ? 'admin' : 'member')

        formData.append('addresses[full_name]', inputName.value)
        formData.append(
            'addresses[phone_no]',
            `+${selectedCountryCode}${inputPhoneNumber.value}`
        )
        formData.append('addresses[address]', inputAddress.value)
        formData.append('addresses[country]', selectedCountry)
        formData.append('addresses[state]', selectedState)
        formData.append('addresses[city]', selectedCity)
        formData.append('addresses[zip_code]', inputZipCode.value)
        formData.append('addresses[property_type]', 'house')

        //6) Dispatch action to create the user
        dispatch(createUserAsync({ formData, cb: () => setShowAlert(true) }))
    }

    return (
        <AddNewCustomerStyled>
            {showAlert && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: '16px',
                        paddingBottom: '40px',
                    }}
                >
                    <Alert
                        ref={refAlert}
                        sx={{ width: '100%', textAlign: 'left' }}
                        severity={errorsUser.create ? 'error' : 'success'}
                        onClose={() => setShowAlert(false)}
                        variant="outlined"
                    >
                        <AlertTitle>
                            {errorsUser.create
                                ? 'An error occured!'
                                : 'Success!'}
                        </AlertTitle>
                        {errorsUser.create
                            ? errorsUser.create
                            : 'Customer has been created successfully.'}
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
                            inputRef={refInputName}
                            value={inputName.value}
                            fullWidth={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutline />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormGroup style={{ gap: '0' }}>
                            <TextField
                                label="Country Code"
                                value={selectedCountryCode}
                                onChange={(e) =>
                                    setSelectedCountryCode(e.target.value)
                                }
                                inputRef={refInputCountryCode}
                                ref={refCountryCode}
                                id="outlined-select-currency"
                                select
                                sx={{ flex: '0 0 108px !important' }}
                            >
                                <MenuItem value="select">Select Code</MenuItem>
                                {countries.map((country) => (
                                    <MenuItem
                                        key={country.name}
                                        value={country.phone_code}
                                    >
                                        {country.emoji +
                                            ' ' +
                                            country.phone_code}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Phone Number"
                                error={inputPhoneNumber.validation.error}
                                helperText={inputPhoneNumber.validation.message}
                                onChange={inputPhoneNumber.onChangeHandler}
                                onBlur={inputPhoneNumber.onBlurHandler}
                                inputRef={refInputPhonoNo}
                                value={inputPhoneNumber.value}
                                fullWidth={true}
                            />
                        </FormGroup>
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Zip Code"
                            error={inputZipCode.validation.error}
                            helperText={inputZipCode.validation.message}
                            onChange={inputZipCode.onChangeHandler}
                            onBlur={inputZipCode.onBlurHandler}
                            inputRef={refInputZipCode}
                            value={inputZipCode.value}
                        />
                        <TextField
                            label="Full Address"
                            error={inputAddress.validation.error}
                            helperText={inputAddress.validation.message}
                            onChange={inputAddress.onChangeHandler}
                            onBlur={inputAddress.onBlurHandler}
                            inputRef={refInputAddress}
                            value={inputAddress.value}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOnOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            select={true}
                            label="Country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            inputRef={refInputCountry}
                            ref={refCountry}
                        >
                            <MenuItem disabled={true} value="select">
                                Select Country
                            </MenuItem>
                            {countries.map((country) => (
                                <MenuItem
                                    key={country.name}
                                    value={country.name}
                                >
                                    {country.emoji + ' ' + country.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select={true}
                            label="State/Province"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            inputRef={refInputState}
                            ref={refState}
                        >
                            <MenuItem disabled={true} value="select">
                                Select State/Province
                            </MenuItem>
                            {countries
                                .find(
                                    (country) =>
                                        country.name === selectedCountry
                                )
                                ?.states.map((state) => (
                                    <MenuItem
                                        key={state.name}
                                        value={state.name}
                                    >
                                        {state.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                        <TextField
                            select={true}
                            label="City/District"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            inputRef={refInputCity}
                            ref={refCity}
                        >
                            <MenuItem disabled={true} value="select">
                                Select City/District
                            </MenuItem>
                            {countries
                                .find(
                                    (country) =>
                                        country.name === selectedCountry
                                )
                                ?.states.find(
                                    (state) => state.name === selectedState
                                )
                                ?.cities.map((city) => (
                                    <MenuItem value={city.name}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Tell us something about yourself"
                            error={inputBio.validation.error}
                            helperText={inputBio.validation.message}
                            onChange={inputBio.onChangeHandler}
                            onBlur={inputBio.onBlurHandler}
                            inputRef={refInputBio}
                            value={inputBio.value}
                            multiline={true}
                            rows={4}
                        />
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
                            error={inputUsername.validation.error}
                            helperText={inputUsername.validation.message}
                            onChange={inputUsername.onChangeHandler}
                            onBlur={inputUsername.onBlurHandler}
                            inputRef={refInputUsername}
                            value={inputUsername.value}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutline />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isAdmin}
                                        value={isAdmin}
                                        onChange={() =>
                                            setIsAdmin((state) => !state)
                                        }
                                    />
                                }
                                label="Is Admin?"
                            />
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            label="Email"
                            error={inputEmail.validation.error}
                            helperText={inputEmail.validation.message}
                            onChange={inputEmail.onChangeHandler}
                            onBlur={inputEmail.onBlurHandler}
                            type="email"
                            inputRef={refInputEmail}
                            value={inputEmail.value}
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
                            error={inputPassword.validation.error}
                            helperText={inputPassword.validation.message}
                            onChange={inputPassword.onChangeHandler}
                            onBlur={inputPassword.onBlurHandler}
                            ref={refInputPassword}
                            value={inputPassword.value}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            error={inputPasswordConfirm.validation.error}
                            helperText={inputPasswordConfirm.validation.message}
                            onChange={inputPasswordConfirm.onChangeHandler}
                            onBlur={inputPasswordConfirm.onBlurHandler}
                            ref={refInputConfirmPassword}
                            value={inputPasswordConfirm.value}
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
            </Widget>
            <Box sx={{ display: 'flex', gap: '16px', paddingTop: '40px' }}>
                <Button
                    disableElevation={true}
                    size="large"
                    variant="contained"
                    onClick={clickCreateCustomerHandler}
                    disabled={isLoadingUser.create}
                >
                    {isLoadingUser.create ? (
                        <CircularProgress size={24} />
                    ) : (
                        'Create Customer'
                    )}
                </Button>
                <Button
                    size="large"
                    variant="outlined"
                    onClick={resetAllInputsHandler}
                >
                    Clear Fields
                </Button>
            </Box>
        </AddNewCustomerStyled>
    )
}

export default AddNewCustomer
