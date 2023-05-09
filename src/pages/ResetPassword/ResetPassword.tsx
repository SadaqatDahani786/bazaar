import { useEffect, useRef, useState } from 'react'

import {
    Alert,
    AlertTitle,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material'

import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import { resetPasswordAsync, setUser } from '../../store/authReducer'
import { getUserAsync } from '../../store/userReducer'

//Hooks & Func
import useInput from '../../hooks/useInput'
import {
    combineValidators,
    isEmpty,
    isPassStrong,
    isPassMissmatched,
} from '../../utils/validators'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Reset Password
const ResetPasswordStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
    min-height: 100vh;
`

//Inner Wrapper
const InnerWrapper = styled.div`
    width: 600px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 40px;
    background: white;
    border-radius: 16px;
`

//Link
const LinkStyled = styled(Link)`
    text-decoration: none;
    font-family: 'Playfair Display';
    font-size: 5rem;

    &:visited,
    &:active {
        color: ${(props) => props.theme.palette.primary.main};
    }
`
/**
 ** ======================================================
 ** Component [ResetPassword]
 ** ======================================================
 */
const ResetPassword = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const loggedInUser = useAppSelector((state) => state.auth.data)
    const isLoading = useAppSelector((state) => state.auth.isLoading)
    const error = useAppSelector((state) => state.auth.error)
    const dispatch = useAppDispatch()

    //Navigation
    const params = useParams()
    const navigate = useNavigate()

    //State
    const [showAlert, setShowAlert] = useState(false)

    //Refs
    const refInputPassword = useRef<HTMLInputElement>(null)
    const refInputPasswordConfirm = useRef<HTMLInputElement>(null)

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
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
    //Check if user already logged in
    useEffect(() => {
        if (loggedInUser) return

        //1) Get id
        const id = localStorage.getItem('user_id')

        //2) Validate
        if (!id) return

        //3) Set user
        dispatch(
            getUserAsync({
                id,
                cb: (user) => {
                    dispatch(setUser(user))
                },
            })
        )
    }, [])

    //Rediect when user logged in
    useEffect(() => {
        //1) Check if user logged in
        if (!loggedInUser) return

        //2) User logged in, redirect
        navigate('/')
    }, [loggedInUser])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click reset handler
    const clickResetHandler = () => {
        //1) Trigger Validation
        inputPassword.validation.validate()
        inputPasswordConfirm.validation.validate()

        //2) Focus on invalid input fields
        if (inputPassword.validation.error || !inputPassword.validation.touched)
            return refInputPassword.current?.focus()
        else if (
            inputPasswordConfirm.validation.error ||
            !inputPasswordConfirm.validation.touched
        )
            return refInputPasswordConfirm.current?.focus()

        //3) No errors proceed with creating formData
        const formData = new FormData()

        formData.append('password', inputPassword.value)
        formData.append('password_confirm', inputPasswordConfirm.value)

        //4) Dispatch action to reset password
        dispatch(
            resetPasswordAsync({ formData, token: params.token as string })
        )

        //5) Set show alert
        setShowAlert(true)
    }

    return (
        <ResetPasswordStyled>
            <InnerWrapper>
                {showAlert && error ? (
                    <Alert
                        sx={{ textAlign: 'left' }}
                        variant="outlined"
                        severity="error"
                        color="error"
                        onClose={() => setShowAlert(false)}
                    >
                        <AlertTitle>Error Occured!</AlertTitle>
                        {error}
                    </Alert>
                ) : (
                    ''
                )}
                <Stack>
                    <LinkStyled to="/">Bazaar</LinkStyled>
                </Stack>
                <Stack gap="8px">
                    <Typography variant="h5" fontWeight="bold">
                        Reset Your Password
                    </Typography>
                    <Typography>
                        Please give a new password to reset your account
                        password.
                    </Typography>
                </Stack>
                <Stack gap="8px">
                    <TextField
                        label="New Password"
                        value={inputPassword.value}
                        onChange={inputPassword.onChangeHandler}
                        onBlur={inputPassword.onBlurHandler}
                        error={inputPassword.validation.error}
                        helperText={inputPassword.validation.message}
                        inputRef={refInputPassword}
                        type="password"
                    />
                    <TextField
                        label="New Password Confirm"
                        value={inputPasswordConfirm.value}
                        onChange={inputPasswordConfirm.onChangeHandler}
                        onBlur={inputPasswordConfirm.onBlurHandler}
                        error={inputPasswordConfirm.validation.error}
                        helperText={inputPasswordConfirm.validation.message}
                        inputRef={refInputPasswordConfirm}
                        type="password"
                    />
                </Stack>
                <Stack>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ padding: '20px 0' }}
                        onClick={clickResetHandler}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> : 'Reset'}
                    </Button>
                </Stack>
            </InnerWrapper>
        </ResetPasswordStyled>
    )
}

export default ResetPassword
