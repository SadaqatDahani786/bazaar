import { useEffect, useRef, useState } from 'react'

import {
    AccessTimeFilled,
    HomeOutlined,
    LocationOn,
    Mail,
    Phone,
    Send,
} from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'

import styled from 'styled-components'
import { Link as RouterLink, useLocation } from 'react-router-dom'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import { sendEmailAsync } from '../../store/mailReducer'

//Components
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

//Hooks & Func
import useInput from '../../hooks/useInput'
import {
    combineValidators,
    isAlpha,
    isAlphaNumeric,
    isEmail,
    isEmpty,
} from '../../utils/validators'

//Assets
import ContactUsHeaderImage from '../../assets/images/contact-us.avif'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Contact
const ContactStyled = styled.div`
    width: 100%;
    min-height: 100%;
`

//Hero
const Hero = styled.div`
    width: 100%;
    height: 80vh;
    overflow: hidden;
    position: relative;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

//Overlay
const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.palette.primary.light};
`

//Heading
const Heading = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
 ** Component [Contact]
 ** ======================================================
 */
const Contact = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const isLoading = useAppSelector((state) => state.mail.isLoading)
    const error = useAppSelector((state) => state.mail.error)
    const dispatch = useAppDispatch()

    //State/Hooks
    const [showAlert, setShowAlert] = useState(false)
    const location = useLocation()

    //Refs
    const refInputName = useRef<HTMLInputElement>(null)
    const refInputEmail = useRef<HTMLInputElement>(null)
    const refInputSubject = useRef<HTMLInputElement>(null)
    const refInputMessage = useRef<HTMLInputElement>(null)

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Input Name
    const inputName = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: "What's your name?",
            },
            {
                validator: isAlpha,
                message: 'Please enter a valid name with letters only.',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                },
            },
        ]),
    })

    //Input Email
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

    //Input Subject
    const inputSubject = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Enter subject of an email',
            },
            {
                validator: isAlphaNumeric,
                message:
                    'Only numbers, letters or puntuation marks are allowed.',
                options: {
                    ignoreCase: true,
                    ignorePunctuations: true,
                    ignoreSpaces: true,
                },
            },
        ]),
    })

    //Input Message
    const inputMessage = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Enter your message',
            },
            {
                validator: isAlphaNumeric,
                message:
                    'Only numbers, letters or puntuation marks are allowed.',
                options: {
                    ignoreCase: true,
                    ignorePunctuations: true,
                    ignoreSpaces: true,
                },
            },
        ]),
    })

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Scroll to top
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [location.pathname])

    //Set alert and rest inputs
    useEffect(() => {
        if (!isLoading) return

        //1) Show Alert
        setShowAlert(true)

        //2) Reset
        inputName.reset(false)
        inputEmail.reset(false)
        inputSubject.reset(false)
        inputMessage.reset(false)
    }, [isLoading])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click send email
    const clickSendEmail = () => {
        //1) Hide Alert
        setShowAlert(false)

        //2) Trigger validation
        inputName.validation.validate()
        inputEmail.validation.validate()
        inputSubject.validation.validate()
        inputMessage.validation.validate()

        //3) Focus on invalid fields
        if (inputName.validation.error || !inputName.validation.touched)
            return refInputName.current?.focus()
        else if (inputEmail.validation.error || !inputEmail.validation.touched)
            return refInputEmail.current?.focus()
        else if (
            inputSubject.validation.error ||
            !inputSubject.validation.touched
        )
            return refInputSubject.current?.focus()
        else if (
            inputMessage.validation.error ||
            !inputMessage.validation.touched
        )
            return refInputMessage.current?.focus()

        //4) No errors, send an email
        dispatch(
            sendEmailAsync({
                name: inputName.value,
                email: inputEmail.value,
                subject: inputSubject.value,
                message: inputMessage.value,
            })
        )
    }

    return (
        <ContactStyled>
            <Header />
            <Hero>
                <Overlay />
                <img src={ContactUsHeaderImage} alt="an image of a guy" />
                <Heading>
                    <Typography variant="h2" color="secondary">
                        Contact Us
                    </Typography>
                    <Typography color="secondary" variant="h6">
                        Here you can reach out to us for any queries that you
                        might have
                    </Typography>
                </Heading>
            </Hero>
            <Toolbar>
                <Breadcrumbs>
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
                    <Typography color="primary">Contact</Typography>
                </Breadcrumbs>
            </Toolbar>
            <Stack padding="48px 180px" columnGap="80px" flexDirection="row">
                <Stack flex={2} gap="16px">
                    {showAlert && (
                        <Alert
                            sx={{ textAlign: 'left' }}
                            variant="outlined"
                            severity={error ? 'error' : 'success'}
                            onClose={() => setShowAlert(false)}
                        >
                            <AlertTitle>
                                {error ? 'Error Occured!' : 'Succesful!'}
                            </AlertTitle>
                            {error ||
                                'Email has been recieved, we will get back to you as soon as we can.'}
                        </Alert>
                    )}
                    <Typography textAlign="left" variant="h5">
                        Get in touch
                    </Typography>
                    <Stack gap="16px" flexDirection="row">
                        <Stack flex={1}>
                            <TextField
                                label="Name"
                                value={inputName.value}
                                onChange={inputName.onChangeHandler}
                                onBlur={inputName.onBlurHandler}
                                error={inputName.validation.error}
                                helperText={inputName.validation.message}
                                inputRef={refInputName}
                                fullWidth
                            />
                        </Stack>
                        <Stack flex={1}>
                            <TextField
                                label="Email"
                                value={inputEmail.value}
                                onChange={inputEmail.onChangeHandler}
                                onBlur={inputEmail.onBlurHandler}
                                error={inputEmail.validation.error}
                                helperText={inputEmail.validation.message}
                                inputRef={refInputEmail}
                                type="email"
                                fullWidth
                            />
                        </Stack>
                    </Stack>
                    <Stack>
                        <Stack flex={1}>
                            <TextField
                                label="Subject"
                                value={inputSubject.value}
                                onChange={inputSubject.onChangeHandler}
                                onBlur={inputSubject.onBlurHandler}
                                error={inputSubject.validation.error}
                                helperText={inputSubject.validation.message}
                                inputRef={refInputSubject}
                                fullWidth
                            />
                        </Stack>
                    </Stack>
                    <Stack>
                        <Stack flex={1}>
                            <TextField
                                label="Message"
                                value={inputMessage.value}
                                onChange={inputMessage.onChangeHandler}
                                onBlur={inputMessage.onBlurHandler}
                                error={inputMessage.validation.error}
                                helperText={inputMessage.validation.message}
                                inputRef={refInputMessage}
                                rows={4}
                                multiline
                                fullWidth
                            />
                        </Stack>
                    </Stack>
                    <Box alignSelf="flex-start">
                        <Button
                            endIcon={<Send />}
                            variant="contained"
                            disableElevation
                            onClick={clickSendEmail}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={16} />
                            ) : (
                                'Send'
                            )}
                        </Button>
                    </Box>
                </Stack>
                <Stack flex={1} alignItems="flex-end" gap="16px">
                    <Typography alignSelf="flex-start" variant="h5">
                        Contact Info
                    </Typography>
                    <Table
                        sx={{
                            width: '400px',
                            '& td': {
                                padding: '8px 8px 8px 0px',
                            },
                            '& tr:nth-child(odd) td': {
                                border: '0px',
                            },
                        }}
                    >
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography fontWeight="bold">
                                        Email
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <Mail />
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>
                                        bazaar.incorporation@gmail.com
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography fontWeight="bold">
                                        Phone Number
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <Phone />
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>+353-324-654-5521</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography fontWeight="bold">
                                        Address
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <LocationOn />
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>
                                        45 O'Connell Street, Dublin, Ireland.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography fontWeight="bold">
                                        Timing
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <AccessTimeFilled />
                                </TableCell>
                                <TableCell align="left">
                                    <Typography>
                                        Mon - Fri 9am to 6pm
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Stack>
            </Stack>
            <Footer />
        </ContactStyled>
    )
}

export default Contact
