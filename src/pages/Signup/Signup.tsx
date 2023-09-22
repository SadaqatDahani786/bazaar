import { useEffect, useRef, useState } from 'react'

import { ArrowBack, CloseOutlined, PhotoCamera } from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Link,
    MenuItem,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

//Redux
import { signupAsync } from '../../store/authReducer'
import {
    getCitiesInStateAsync,
    getCountriesAsync,
    getStatesInCountryAsync,
} from '../../store/locationReducer'
import { useAppDispatch, useAppSelector } from '../../store/store'

//Hooks & Func
import useInput from '../../hooks/useInput'
import useUpload from '../../hooks/useUpload'
import isCountryHasStates from '../../utils/isCountryHasStates'
import isStateHasCities from '../../utils/isStateHasCities'
import {
    combineValidators,
    isEmpty,
    isAlpha,
    isMaxLength,
    isPhoneNumber,
    isZipCode,
    isAlphaNumeric,
    isEmail,
    isPassMissmatched,
    isPassStrong,
} from '../../utils/validators'

//Assets
import MensFashionImage from '../../assets/images/mens-fashion.avif'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Signup
const SignupStyled = styled.div`
    width: '100%';
`

//Image View
const ImageView = styled.div`
    flex: 1;
    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

//Signup View
const SignupView = styled.div`
    flex: 2;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
`

/**
 ** ======================================================
 ** Component [Signup]
 ** ======================================================
 */
const Signup = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const [showAlert, setShowAlert] = useState(false)

    //Redux
    const countries = useAppSelector((state) => state.location.data)
    const loggedInUser = useAppSelector((state) => state.auth.data)
    const isLoading = useAppSelector((state) => state.auth.isLoading)
    const error = useAppSelector((state) => state.auth.error)
    const dispatch = useAppDispatch()

    //Selects
    const [selectedCountryCode, setSelectedCountryCode] = useState('select')
    const [selectedCountry, setSelectedCountry] = useState('select')
    const [selectedState, setSelectedState] = useState('select')
    const [selectedCity, setSelectedCity] = useState('select')

    //Hooks
    const navigate = useNavigate()
    const theme = useTheme()

    //Steps
    const [step, setStep] = useState(-1)
    const steps = ['Personal Information', 'Account Information', 'Photo']

    //Refs
    const refInputName = useRef<HTMLInputElement>(null)
    const refInputCountryCode = useRef<HTMLInputElement>(null)
    const refInputPhoneNumber = useRef<HTMLInputElement>(null)
    const refInputCountry = useRef<HTMLInputElement>(null)
    const refInputState = useRef<HTMLInputElement>(null)
    const refInputCity = useRef<HTMLInputElement>(null)
    const refInputZipCode = useRef<HTMLInputElement>(null)
    const refInputAddress = useRef<HTMLInputElement>(null)
    const refInputBio = useRef<HTMLInputElement>(null)
    const refInputUsername = useRef<HTMLInputElement>(null)
    const refInputEmail = useRef<HTMLInputElement>(null)
    const refInputPassword = useRef<HTMLInputElement>(null)
    const refInputPasswordConfirm = useRef<HTMLInputElement>(null)
    const refAvatar = useRef<HTMLLabelElement>(null)

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch all countries when components loads first time
    useEffect(() => {
        dispatch(getCountriesAsync(() => ''))
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

    //Navigate to dashbaaord or profile if user logged in already
    useEffect(() => {
        //1) Check if user already logged in
        if (
            !localStorage.getItem('user_id') ||
            !localStorage.getItem('user_role')
        )
            return

        //2) Admin user logged in, redirect to dashboard
        if (localStorage.getItem('user_role') === 'admin')
            return navigate('/dashboard', { replace: true })

        //3) Normal user logged in, redirect to profile
        navigate('/profile', { replace: true })
    }, [loggedInUser])

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

    //Photo
    const inputPhoto = useUpload({
        default_value: undefined,
    })

    /*
     ** **
     ** ** ** Methodss
     ** **
     */
    const clickSignupHandler = () => {
        //1) Validate inputs on each step
        if (step === -1) {
            //=> Trigger Validation
            inputName.validation.validate()

            //=> Focus on invalid input fields
            if (inputName.validation.error || !inputName.validation.touched)
                return refInputName.current?.focus()

            //=> Proceed
            return setStep(0)
        } else if (step === 0) {
            //=> Trigger Validation
            inputName.validation.validate()
            inputPhoneNumber.validation.validate()
            inputAddress.validation.validate()
            inputZipCode.validation.validate()
            inputBio.validation.validate()

            //=> Focus on invalid input fields
            if (inputName.validation.error || !inputName.validation.touched)
                return refInputName.current?.focus()
            else if (
                selectedCountryCode === 'select' ||
                selectedCountryCode === ''
            )
                return refInputCountryCode.current?.focus()
            else if (
                inputPhoneNumber.validation.error ||
                !inputPhoneNumber.validation.touched
            )
                return refInputPhoneNumber.current?.focus()
            else if (!selectedCountry || selectedCountry === 'select')
                return refInputCountry.current?.focus()
            else if (
                isCountryHasStates(countries, selectedCountry) &&
                (!selectedState || selectedState === 'select')
            )
                return refInputState.current?.focus()
            else if (
                isStateHasCities(countries, selectedCountry, selectedState) &&
                (!selectedCity || selectedCity === 'select')
            )
                return refInputCity.current?.focus()
            else if (
                inputZipCode.validation.error ||
                !inputZipCode.validation.touched
            )
                return refInputZipCode.current?.focus()
            else if (
                inputAddress.validation.error ||
                !inputAddress.validation.touched
            )
                return refInputAddress.current?.focus()
            else if (inputBio.validation.error || !inputBio.validation.touched)
                return refInputBio.current?.focus()

            //=> Proceed
            return setStep(1)
        } else if (step === 1) {
            //=> Trigger Validation
            inputUsername.validation.validate()
            inputEmail.validation.validate()
            inputPassword.validation.validate()
            inputPasswordConfirm.validation.validate()

            //=> Focus on invalid input fields
            if (
                inputUsername.validation.error ||
                !inputUsername.validation.touched
            )
                return refInputUsername.current?.focus()
            else if (
                inputEmail.validation.error ||
                !inputEmail.validation.touched
            )
                return refInputEmail.current?.focus()
            else if (
                inputPassword.validation.error ||
                !inputPassword.validation.touched
            )
                return refInputPassword.current?.focus()
            else if (
                inputPasswordConfirm.validation.error ||
                !inputPasswordConfirm.validation.touched
            )
                return refInputPasswordConfirm.current?.focus()

            //=> Proceed
            return setStep(2)
        } else if (step === 2) {
            //=> Trigger validation
            inputPhoto.validation.validate()

            //=> Focus on invalid input fields
            if (inputPhoto.validation.error || !inputPhoto.validation.touched)
                return refAvatar.current?.focus()
        }

        //2) No errors, proceed with creating form data
        const formData = new FormData()

        formData.append('name', inputName.value)
        formData.append('email', inputEmail.value)
        formData.append('username', inputUsername.value)
        formData.append('bio', inputBio.value)
        formData.append('password', inputPassword.value)
        formData.append('password_confirm', inputPasswordConfirm.value)
        formData.append('photo', inputPhoto.value[0].file as File)
        formData.append(
            'phone_no',
            `+${selectedCountryCode}${inputPhoneNumber.value}`
        )

        formData.append('addresses[0][full_name]', inputName.value)
        formData.append('addresses[0][country]', selectedCountry)
        formData.append('addresses[0][state]', selectedState)
        formData.append('addresses[0][city]', selectedCity)
        formData.append('addresses[0][zip_code]', inputZipCode.value)
        formData.append('addresses[0][address]', inputAddress.value)
        formData.append('addresses[0][property_type]', 'house')
        formData.append('addresses[0][default_billing_address]', 'true')
        formData.append('addresses[0][default_shipping_address]', 'true')
        formData.append(
            'addresses[0][phone_no]',
            `+${selectedCountryCode}${inputPhoneNumber.value}`
        )

        //3) dispatch action signup user
        dispatch(signupAsync(formData))
    }

    //Show alert when http req sent
    useEffect(() => {
        if (!isLoading) return

        setShowAlert(true)
    }, [isLoading])

    return (
        <SignupStyled>
            <Stack flexDirection="row" minHeight="100vh">
                <ImageView>
                    <img
                        src={MensFashionImage}
                        alt="an image of person wearing fashionable clother"
                    />
                </ImageView>
                <SignupView>
                    {showAlert && error ? (
                        <Alert
                            sx={{ width: '100%', textAlign: 'left' }}
                            severity="error"
                            variant="outlined"
                            onClose={() => setShowAlert(false)}
                        >
                            <AlertTitle>Error Occured!</AlertTitle>
                            {error}
                        </Alert>
                    ) : (
                        ''
                    )}
                    <Stack alignSelf="flex-end">
                        <IconButton onClick={() => navigate('/')}>
                            <CloseOutlined />
                        </IconButton>
                    </Stack>
                    {step === -1 ? (
                        <Stack
                            sx={{ width: '45%' }}
                            alignItems="center"
                            justifyContent="center"
                            gap="48px"
                        >
                            <Stack
                                sx={{ width: '100%', textAlign: 'left' }}
                                gap="16px"
                            >
                                <Typography variant="h2">
                                    Create an account!
                                </Typography>
                                <Typography variant="body1">
                                    Please enter your full name to get started.
                                </Typography>
                            </Stack>
                            <Stack sx={{ width: '100%' }} gap="16px">
                                <TextField
                                    label="Your Full Name"
                                    fullWidth={true}
                                    value={inputName.value}
                                    onChange={inputName.onChangeHandler}
                                    onBlur={inputName.onBlurHandler}
                                    error={inputName.validation.error}
                                    helperText={inputName.validation.message}
                                    inputRef={refInputName}
                                />
                            </Stack>
                            <Box sx={{ width: '100%' }}>
                                <Button
                                    sx={{ padding: '20px 0' }}
                                    variant="contained"
                                    fullWidth={true}
                                    size="large"
                                    onClick={clickSignupHandler}
                                >
                                    Let's Get Started
                                </Button>
                            </Box>
                        </Stack>
                    ) : (
                        <Stack sx={{ width: '80%' }} gap="80px">
                            <Stack gap="16px">
                                <Typography variant="h4">
                                    Hello {inputName.value}, nice to meet you!
                                </Typography>
                                <Typography>
                                    Please complete the steps below to create
                                    your account.
                                </Typography>
                            </Stack>
                            <Stepper activeStep={step} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {step === 0 ? (
                                <Stack gap="16px">
                                    <Stack flexDirection="row" gap="16px">
                                        <Stack flex={1}>
                                            <TextField
                                                label="Full Name"
                                                value={inputName.value}
                                                onChange={
                                                    inputName.onChangeHandler
                                                }
                                                onBlur={inputName.onBlurHandler}
                                                error={
                                                    inputName.validation.error
                                                }
                                                helperText={
                                                    inputName.validation.message
                                                }
                                                inputRef={refInputName}
                                                disabled={true}
                                            />
                                        </Stack>
                                        <Stack flexDirection="row" flex={1}>
                                            <TextField
                                                label="Code"
                                                sx={{ width: '148px' }}
                                                value={selectedCountryCode}
                                                onChange={(e) =>
                                                    setSelectedCountryCode(
                                                        e.target.value
                                                    )
                                                }
                                                inputRef={refInputCountryCode}
                                                select
                                            >
                                                <MenuItem
                                                    disabled
                                                    value="select"
                                                >
                                                    Select
                                                </MenuItem>
                                                {countries.map((country) => (
                                                    <MenuItem
                                                        key={country.name}
                                                        value={
                                                            country.phone_code
                                                        }
                                                    >
                                                        {country.emoji}{' '}
                                                        {country.phone_code}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                fullWidth={true}
                                                label="Phone Number"
                                                value={inputPhoneNumber.value}
                                                onChange={
                                                    inputPhoneNumber.onChangeHandler
                                                }
                                                onBlur={
                                                    inputPhoneNumber.onBlurHandler
                                                }
                                                error={
                                                    inputPhoneNumber.validation
                                                        .error
                                                }
                                                helperText={
                                                    inputPhoneNumber.validation
                                                        .message
                                                }
                                                inputRef={refInputPhoneNumber}
                                            />
                                        </Stack>
                                    </Stack>
                                    <Stack flexDirection="row" gap="16px">
                                        <Stack flex={1}>
                                            <TextField
                                                label="Country"
                                                value={selectedCountry}
                                                onChange={(e) =>
                                                    setSelectedCountry(
                                                        e.target.value
                                                    )
                                                }
                                                inputRef={refInputCountry}
                                                select
                                            >
                                                <MenuItem
                                                    disabled
                                                    value="select"
                                                >
                                                    Select
                                                </MenuItem>
                                                {countries.map((country) => (
                                                    <MenuItem
                                                        key={country.name}
                                                        value={country.name}
                                                    >
                                                        {country.emoji}{' '}
                                                        {country.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Stack>
                                        <Stack flex={1}>
                                            <TextField
                                                label="State"
                                                value={selectedState}
                                                onChange={(e) =>
                                                    setSelectedState(
                                                        e.target.value
                                                    )
                                                }
                                                inputRef={refInputState}
                                                select
                                            >
                                                <MenuItem
                                                    disabled
                                                    value="select"
                                                >
                                                    Select
                                                </MenuItem>
                                                {countries
                                                    .find(
                                                        (country) =>
                                                            country.name ===
                                                            selectedCountry
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
                                        </Stack>
                                        <Stack flex={1}>
                                            <TextField
                                                label="City"
                                                value={selectedCity}
                                                onChange={(e) =>
                                                    setSelectedCity(
                                                        e.target.value
                                                    )
                                                }
                                                inputRef={refInputCity}
                                                select
                                            >
                                                <MenuItem
                                                    disabled
                                                    value="select"
                                                >
                                                    Select
                                                </MenuItem>
                                                {countries
                                                    .find(
                                                        (country) =>
                                                            country.name ===
                                                            selectedCountry
                                                    )
                                                    ?.states.find(
                                                        (state) =>
                                                            state.name ===
                                                            selectedState
                                                    )
                                                    ?.cities.map((city) => (
                                                        <MenuItem
                                                            key={city.name}
                                                            value={city.name}
                                                        >
                                                            {city.name}
                                                        </MenuItem>
                                                    ))}
                                            </TextField>
                                        </Stack>
                                    </Stack>
                                    <Stack flexDirection="row" gap="16px">
                                        <Stack flex={1}>
                                            <TextField
                                                label="Zip Code"
                                                value={inputZipCode.value}
                                                onChange={
                                                    inputZipCode.onChangeHandler
                                                }
                                                onBlur={
                                                    inputZipCode.onBlurHandler
                                                }
                                                error={
                                                    inputZipCode.validation
                                                        .error
                                                }
                                                helperText={
                                                    inputZipCode.validation
                                                        .message
                                                }
                                                inputRef={refInputZipCode}
                                            />
                                        </Stack>
                                        <Stack flex={1}>
                                            <TextField
                                                label="Address"
                                                value={inputAddress.value}
                                                onChange={
                                                    inputAddress.onChangeHandler
                                                }
                                                onBlur={
                                                    inputAddress.onBlurHandler
                                                }
                                                error={
                                                    inputAddress.validation
                                                        .error
                                                }
                                                helperText={
                                                    inputAddress.validation
                                                        .message
                                                }
                                                inputRef={refInputAddress}
                                            />
                                        </Stack>
                                    </Stack>
                                    <Stack flexDirection="row" gap="16px">
                                        <Stack flex={1}>
                                            <TextField
                                                label="Bio"
                                                multiline
                                                rows={4}
                                                value={inputBio.value}
                                                onChange={
                                                    inputBio.onChangeHandler
                                                }
                                                onBlur={inputBio.onBlurHandler}
                                                error={
                                                    inputBio.validation.error
                                                }
                                                helperText={
                                                    inputBio.validation.message
                                                }
                                                inputRef={refInputBio}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            ) : step === 1 ? (
                                <Stack gap="16px">
                                    <Stack flexDirection="row" gap="16px">
                                        <Stack flex={1}>
                                            <TextField
                                                label="Username"
                                                value={inputUsername.value}
                                                onChange={
                                                    inputUsername.onChangeHandler
                                                }
                                                onBlur={
                                                    inputUsername.onBlurHandler
                                                }
                                                error={
                                                    inputUsername.validation
                                                        .error
                                                }
                                                helperText={
                                                    inputUsername.validation
                                                        .message
                                                }
                                                inputRef={refInputUsername}
                                                fullWidth={true}
                                            />
                                        </Stack>
                                        <Stack flex={2}>
                                            <TextField
                                                label="Email"
                                                type="email"
                                                value={inputEmail.value}
                                                onChange={
                                                    inputEmail.onChangeHandler
                                                }
                                                onBlur={
                                                    inputEmail.onBlurHandler
                                                }
                                                error={
                                                    inputEmail.validation.error
                                                }
                                                helperText={
                                                    inputEmail.validation
                                                        .message
                                                }
                                                inputRef={refInputEmail}
                                                fullWidth={true}
                                            />
                                        </Stack>
                                    </Stack>
                                    <Stack flexDirection="row" gap="16px">
                                        <Stack flex={1}>
                                            <TextField
                                                label="Password"
                                                type="password"
                                                value={inputPassword.value}
                                                onChange={
                                                    inputPassword.onChangeHandler
                                                }
                                                onBlur={
                                                    inputPassword.onBlurHandler
                                                }
                                                error={
                                                    inputPassword.validation
                                                        .error
                                                }
                                                helperText={
                                                    inputPassword.validation
                                                        .message
                                                }
                                                inputRef={refInputPassword}
                                                fullWidth={true}
                                            />
                                        </Stack>
                                        <Stack flex={1}>
                                            <TextField
                                                label="Password Confirm"
                                                type="password"
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
                                                        .validation.error
                                                }
                                                helperText={
                                                    inputPasswordConfirm
                                                        .validation.message
                                                }
                                                inputRef={
                                                    refInputPasswordConfirm
                                                }
                                                fullWidth={true}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            ) : (
                                <Stack alignItems="center" gap="24px">
                                    <Typography
                                        variant="h6"
                                        sx={{ maxWidth: '320px' }}
                                    >
                                        Upload your profile picture
                                    </Typography>
                                    <IconButton
                                        color="secondary"
                                        sx={{
                                            width: '140px',
                                            height: '140px',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            background:
                                                inputPhoto.value.length > 0
                                                    ? 'transparent'
                                                    : 'black',
                                            ':hover': {
                                                border: '1px solid black',
                                                background:
                                                    theme.palette.primary.light,
                                            },
                                            ':focus': {
                                                outline: `3px solid ${
                                                    inputPhoto.validation.error
                                                        ? theme.palette.error
                                                              .main
                                                        : theme.palette.info
                                                              .main
                                                }`,
                                            },
                                        }}
                                        component="label"
                                        aria-label="upload-picture"
                                        ref={refAvatar}
                                    >
                                        <PhotoCamera
                                            fontSize="large"
                                            color="secondary"
                                        />
                                        {inputPhoto.value.length > 0 && (
                                            <img
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    zIndex: -1,
                                                }}
                                                src={inputPhoto.value[0].url}
                                                alt={inputPhoto.value[0].name}
                                            />
                                        )}
                                        <input
                                            type="file"
                                            hidden={true}
                                            accept="image/*"
                                            onChange={inputPhoto.onChange}
                                            onBlur={inputPhoto.onBlur}
                                        />
                                    </IconButton>
                                    {inputPhoto.validation.error && (
                                        <Typography
                                            color="error"
                                            variant="caption"
                                        >
                                            Please select a profile picture
                                        </Typography>
                                    )}
                                </Stack>
                            )}
                            <Stack
                                flexDirection="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                gap="16px"
                            >
                                <Button
                                    disabled={step < 0}
                                    startIcon={<ArrowBack />}
                                    onClick={() =>
                                        setStep((state) => state - 1)
                                    }
                                    size="large"
                                >
                                    Back
                                </Button>
                                <Button
                                    size="large"
                                    variant="contained"
                                    onClick={clickSignupHandler}
                                    sx={{ minWidth: '224px' }}
                                    disabled={isLoading}
                                >
                                    {step >= 2 ? (
                                        isLoading ? (
                                            <CircularProgress color="secondary" />
                                        ) : (
                                            'Create my account'
                                        )
                                    ) : (
                                        'Continue'
                                    )}
                                </Button>
                            </Stack>
                        </Stack>
                    )}

                    <Stack
                        flexDirection="row"
                        justifyContent="center"
                        gap="16px"
                    >
                        <Typography>Already have an account?</Typography>
                        <Link
                            fontWeight="bold"
                            onClick={() => navigate('/login')}
                        >
                            Log In!
                        </Link>
                    </Stack>
                </SignupView>
            </Stack>
        </SignupStyled>
    )
}

export default Signup
