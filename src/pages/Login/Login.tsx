import { useEffect, useRef, useState } from 'react'

import { CloseOutlined } from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    Link,
    TextField,
    Typography,
} from '@mui/material'
import { Stack } from '@mui/system'

import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

//Redux
import { forgotPasswordAsync, loginAsync } from '../../store/authReducer'
import { useAppDispatch, useAppSelector } from '../../store/store'

//Hooks & Func
import useInput from '../../hooks/useInput'
import { combineValidators, isEmail, isEmpty } from '../../utils/validators'

//Assets
import MensFashionImage from '../../assets/images/mens-fashion.avif'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Login
const LoginStyled = styled.div`
    width: 100%;
`

//Login View
const LoginView = styled.div`
    flex: 1;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
`

//Image View
const ImageView = styled.div`
    height: 100vh;
    flex: 1;

    & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

/**
 ** ======================================================
 ** Component [Login]
 ** ======================================================
 */
const Login = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const isLoading = useAppSelector((state) => state.auth.isLoading)
    const error = useAppSelector((state) => state.auth.error)
    const loggedInUser = useAppSelector((state) => state.auth.data)
    const dispatch = useAppDispatch()

    //State
    const [showAlert, setShowAlert] = useState(false)
    const [isForgetPassword, setIsForgetPassword] = useState(false)

    //Navigation
    const navigate = useNavigate()

    //Refs
    const refInputEmail = useRef<HTMLInputElement>(null)
    const refInputPassword = useRef<HTMLInputElement>(null)

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
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

    //Reset input on checkbox change
    useEffect(() => {
        //=> Reset
        inputEmail.reset(false)
        inputPassword.reset(false)
        setShowAlert(false)
    }, [isForgetPassword])

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Email
    const inputEmail = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please enter your email address.',
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
                message: 'Please enter your password.',
            },
        ]),
    })

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click login handler
    const clickLoginHandler = () => {
        //1) Trigger Validation
        inputEmail.validation.validate()
        inputPassword.validation.validate()

        //2) Focus on invalid input fields
        if (inputEmail.validation.error || !inputEmail.validation.touched)
            return refInputEmail.current?.focus()
        else if (
            inputPassword.validation.error ||
            !inputEmail.validation.touched
        )
            return refInputPassword.current?.focus()

        //3) No errors, proceed with request
        dispatch(
            loginAsync({
                email: inputEmail.value,
                password: inputPassword.value,
            })
        )

        //4) Show alert
        setShowAlert(true)
    }

    //Click reset password
    const clickResetPassword = () => {
        //1) Trigger Validation
        inputEmail.validation.validate()

        //2) Focus on invalid field
        if (inputEmail.validation.error || !inputEmail.validation.touched)
            return refInputEmail.current?.focus()

        //3) Dispatch action to reset password
        dispatch(
            forgotPasswordAsync({
                email: inputEmail.value,
                cb: () => {
                    //=> Reset input fields
                    inputEmail.reset(false)

                    //=> Show alert
                    setShowAlert(true)
                },
            })
        )
    }

    return (
        <LoginStyled>
            <Stack flexDirection="row" minHeight="100vh">
                <ImageView>
                    <img
                        src={MensFashionImage}
                        alt="an image of person wearing fashionable clother"
                    />
                </ImageView>
                <LoginView>
                    {showAlert &&
                    ((!isForgetPassword && error) || isForgetPassword) ? (
                        <Alert
                            severity={error ? 'error' : 'success'}
                            variant="outlined"
                            color={error ? 'error' : 'success'}
                            sx={{ textAlign: 'left', width: '100%' }}
                            onClose={() => setShowAlert(false)}
                        >
                            <AlertTitle>
                                {error ? 'Error Occured!' : 'Successful!'}
                            </AlertTitle>
                            <Typography>
                                {error
                                    ? error
                                    : 'An email with the password reset link has been sent to your email address.'}
                            </Typography>
                        </Alert>
                    ) : (
                        ''
                    )}
                    <Stack alignSelf="flex-end">
                        <IconButton onClick={() => navigate('/')}>
                            <CloseOutlined />
                        </IconButton>
                    </Stack>
                    <Stack
                        sx={{
                            width: '78%',
                            padding: '24px',
                        }}
                        alignItems="center"
                        justifyContent="center"
                        gap="48px"
                    >
                        <Typography variant="h4" fontFamily="Playfair Display">
                            Bazaar
                        </Typography>
                        <Stack gap="16px">
                            <Typography variant="h2">
                                {isForgetPassword
                                    ? 'Forgot your password?'
                                    : 'Hello Again!'}
                            </Typography>
                            <Typography variant="body1">
                                {isForgetPassword
                                    ? "Don't worry, we all forget sometimes. Please enter your email address below so we can send you a password reset link."
                                    : 'Welcome back, Nice to see you here again once more with us.'}
                            </Typography>
                        </Stack>
                        <Stack sx={{ width: '100%' }} gap="16px">
                            <TextField
                                label="Email"
                                fullWidth={true}
                                type="email"
                                value={inputEmail.value}
                                onChange={inputEmail.onChangeHandler}
                                onBlur={inputEmail.onBlurHandler}
                                error={inputEmail.validation.error}
                                helperText={inputEmail.validation.message}
                                inputRef={refInputEmail}
                            />
                            {!isForgetPassword && (
                                <TextField
                                    label="Password"
                                    fullWidth={true}
                                    type="password"
                                    value={inputPassword.value}
                                    onChange={inputPassword.onChangeHandler}
                                    onBlur={inputPassword.onBlurHandler}
                                    error={inputPassword.validation.error}
                                    helperText={
                                        inputPassword.validation.message
                                    }
                                    inputRef={refInputPassword}
                                />
                            )}
                            <Stack
                                flexDirection="row"
                                justifyContent="space-between"
                            >
                                <FormControlLabel
                                    label="Forgot Password?"
                                    checked={isForgetPassword}
                                    onChange={() =>
                                        setIsForgetPassword((state) => !state)
                                    }
                                    control={<Checkbox />}
                                />
                            </Stack>
                        </Stack>
                        <Box sx={{ width: '100%' }}>
                            <Button
                                sx={{ padding: '20px 0' }}
                                variant="contained"
                                fullWidth={true}
                                size="large"
                                onClick={
                                    !isForgetPassword
                                        ? clickLoginHandler
                                        : clickResetPassword
                                }
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} />
                                ) : isForgetPassword ? (
                                    'Reset Password'
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </Box>
                    </Stack>
                    <Stack
                        flexDirection="row"
                        justifyContent="center"
                        gap="16px"
                    >
                        <Typography>Don't have an account yet?</Typography>
                        <Link
                            fontWeight="bold"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up!
                        </Link>
                    </Stack>
                </LoginView>
            </Stack>
        </LoginStyled>
    )
}

export default Login
