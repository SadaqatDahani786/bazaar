import { SyntheticEvent, useEffect, useState } from 'react'

import { EditOutlined, PhotoCamera } from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    IconButton,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { getCountriesAsync } from '../../../../store/locationReducer'
import { updateCurrentUserAsync } from '../../../../store/userReducer'
import {
    updatePasswordAsync,
    setUser as setAuthUser,
} from '../../../../store/authReducer'

//Components
import AddressView, {
    IAddress,
} from '../../../../components/AddressView/AddressView'

//Hooks & Func
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
} from '../../../../utils/validators'
import { splitNumberByCode } from '../../../../utils/splitNumberByCode'
import useInput from '../../../../hooks/useInput'
import useUpload from '../../../../hooks/useUpload'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Profile
const ProfileStyled = styled.div`
    border: 1px solid black;
    margin: 32px 0;
    display: flex;
`

//Wrapper
const Wrapper = styled.div`
    width: 100%;
    padding: 32px 0;
    display: flex;
    align-items: center;

    &:not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.palette.grey['300']};
    }

    & > :nth-child(1) {
        width: 10rem;
    }
`

//Row
const Row = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
`

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

/**
 ** ======================================================
 ** Type [ActionType]
 ** ======================================================
 */
export type ActionType =
    | 'name'
    | 'phone_no'
    | 'bio'
    | 'username'
    | 'email'
    | 'password'
    | undefined

/**
 ** ======================================================
 ** Interface [IUserAuth]
 ** ======================================================
 */
export interface IUserAuth {
    _id: string
    name: { value: string; edit: boolean }
    username: { value: string; edit: boolean }
    email: { value: string; edit: boolean }
    bio: { value: string; edit: boolean }
    photo: {
        url: string
        title: string
    }
    phone_no: { value: string; edit: boolean }
    addresses: Array<IAddress>
    password: { value: string; edit: boolean }
    role: 'member' | 'admin'
    created_at: string
}
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
    const countries = useAppSelector((state) => state.location.data)
    const authUser = useAppSelector((state) => state.auth.data)
    const isLoading = useAppSelector((state) => state.user.isLoading)
    const errors = useAppSelector((state) => state.user.errors)
    const dispatch = useAppDispatch()

    //State
    const [selectedCountryCode, setSelectedCountryCode] = useState('select')
    const [user, setUser] = useState<IUserAuth>()
    const [showAlert, setShowAlert] = useState(false)

    //Theme
    const theme = useTheme()

    //Tab
    const [activeTab, setActiveTab] = useState(0)
    const tabs = ['Personal Information', 'Account Information', 'Addresses']

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
    //Fetch all countries when components loads first time
    useEffect(() => {
        dispatch(getCountriesAsync())
    }, [])

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

    /**
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
        setShowAlert(false)

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
                        setShowAlert(true)
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
                        setShowAlert(true)
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
                        setShowAlert(true)
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
                        setShowAlert(true)
                        setUser({
                            ...user,
                            bio: { value: user.bio.value, edit: false },
                        })
                        if (updateduser) dispatch(setAuthUser(updateduser))
                    },
                })
            )
        } else if (type === 'phone_no') {
            formData.append('phone_no', inputPhoneNumber.value)
            dispatch(
                updateCurrentUserAsync({
                    formData,
                    cb: (updateduser) => {
                        setShowAlert(true)
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
                        setShowAlert(true)
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

    return (
        <ProfileStyled>
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
                                activeTab === i ? theme.palette.grey[100] : '',
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
                        severity={errors.update ? 'error' : 'success'}
                        variant="outlined"
                        onClose={() => setShowAlert(false)}
                    >
                        <AlertTitle>
                            {errors.update ? 'Error Occured!' : 'Success!'}
                        </AlertTitle>
                        {errors.update ||
                            'Your profile has been updated successfully.'}
                    </Alert>
                )}
                <TabPanel value={activeTab} index={0}>
                    <Wrapper>
                        <Typography variant="subtitle1" color="GrayText">
                            Profile Photo
                        </Typography>
                        <Row>
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
                                        inputProfilePhoto.modified
                                            ? inputProfilePhoto.value.length > 0
                                                ? inputProfilePhoto.value[0].url
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
                                    onChange={inputProfilePhoto.onChange}
                                />
                            </Avatar>
                        </Row>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle1" color="GrayText">
                            Full Name
                        </Typography>
                        <Row>
                            {user?.name.edit ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    width="100%"
                                >
                                    <TextField
                                        value={inputName.value}
                                        onChange={inputName.onChangeHandler}
                                        onBlur={inputName.onBlurHandler}
                                        error={inputName.validation.error}
                                        helperText={
                                            inputName.validation.message
                                        }
                                        fullWidth={true}
                                    />
                                    <ButtonGroup sx={{ width: '100%' }}>
                                        <Button
                                            disabled={
                                                inputName.validation.error ||
                                                isLoading.update
                                            }
                                            onClick={clickSaveHandler}
                                            data-type="name"
                                        >
                                            {isLoading.update ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                        <Button
                                            data-type="name"
                                            onClick={clickEditHandler}
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
                            {!user?.name.edit && (
                                <IconButton
                                    onClick={clickEditHandler}
                                    data-type="name"
                                >
                                    <EditOutlined />
                                </IconButton>
                            )}
                        </Row>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle1" color="GrayText">
                            Phone Number
                        </Typography>
                        <Row>
                            {user?.phone_no.edit ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    width="100%"
                                >
                                    <Row>
                                        <TextField
                                            label="Country Code"
                                            value={selectedCountryCode}
                                            onChange={(e) =>
                                                setSelectedCountryCode(
                                                    e.target.value
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
                                            fullWidth={true}
                                        />
                                    </Row>
                                    <ButtonGroup sx={{ width: '100%' }}>
                                        <Button
                                            onClick={clickSaveHandler}
                                            disabled={
                                                inputPhoneNumber.validation
                                                    .error || isLoading.update
                                            }
                                            data-type="phone_no"
                                        >
                                            {isLoading.update ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                        <Button
                                            data-type="phone_no"
                                            onClick={clickEditHandler}
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
                            {!user?.name.edit && (
                                <IconButton
                                    onClick={clickEditHandler}
                                    data-type="phone_no"
                                >
                                    <EditOutlined />
                                </IconButton>
                            )}
                        </Row>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle1" color="GrayText">
                            Bio
                        </Typography>
                        <Row>
                            {user?.bio.edit ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    width="100%"
                                >
                                    <TextField
                                        value={inputBio.value}
                                        onChange={inputBio.onChangeHandler}
                                        onBlur={inputBio.onBlurHandler}
                                        error={inputBio.validation.error}
                                        helperText={inputBio.validation.message}
                                        fullWidth={true}
                                        multiline={true}
                                        rows="4"
                                    />
                                    <ButtonGroup sx={{ width: '100%' }}>
                                        <Button
                                            onClick={clickSaveHandler}
                                            disabled={
                                                inputBio.validation.error ||
                                                isLoading.update
                                            }
                                            data-type="bio"
                                        >
                                            {isLoading.update ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                        <Button
                                            data-type="bio"
                                            onClick={clickEditHandler}
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
                            {!user?.name.edit && (
                                <IconButton
                                    onClick={clickEditHandler}
                                    data-type="bio"
                                >
                                    <EditOutlined />
                                </IconButton>
                            )}
                        </Row>
                    </Wrapper>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <Wrapper>
                        <Typography variant="subtitle1" color="GrayText">
                            Username
                        </Typography>
                        <Row>
                            {user?.username.edit ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    width="100%"
                                >
                                    <TextField
                                        value={inputUsername.value}
                                        onChange={inputUsername.onChangeHandler}
                                        onBlur={inputUsername.onBlurHandler}
                                        error={inputUsername.validation.error}
                                        helperText={
                                            inputUsername.validation.message
                                        }
                                        fullWidth={true}
                                    />
                                    <ButtonGroup sx={{ width: '100%' }}>
                                        <Button
                                            onClick={clickSaveHandler}
                                            disabled={
                                                inputUsername.validation
                                                    .error || isLoading.update
                                            }
                                            data-type="username"
                                        >
                                            {isLoading.update ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                        <Button
                                            data-type="username"
                                            onClick={clickEditHandler}
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
                                    {user?.username.value}
                                </Typography>
                            )}
                            {!user?.username.edit && (
                                <IconButton
                                    onClick={clickEditHandler}
                                    data-type="username"
                                >
                                    <EditOutlined />
                                </IconButton>
                            )}
                        </Row>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle1" color="GrayText">
                            Email
                        </Typography>
                        <Row>
                            {user?.email.edit ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    width="100%"
                                >
                                    <TextField
                                        value={inputEmail.value}
                                        onChange={inputEmail.onChangeHandler}
                                        onBlur={inputEmail.onBlurHandler}
                                        error={inputEmail.validation.error}
                                        helperText={
                                            inputEmail.validation.message
                                        }
                                        fullWidth={true}
                                    />
                                    <ButtonGroup sx={{ width: '100%' }}>
                                        <Button
                                            onClick={clickSaveHandler}
                                            disabled={
                                                inputEmail.validation.error ||
                                                isLoading.update
                                            }
                                            data-type="email"
                                        >
                                            {isLoading.update ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                        <Button
                                            data-type="email"
                                            onClick={clickEditHandler}
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
                            {!user?.email.edit && (
                                <IconButton
                                    onClick={clickEditHandler}
                                    data-type="email"
                                >
                                    <EditOutlined />
                                </IconButton>
                            )}
                        </Row>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle1" color="GrayText">
                            Password
                        </Typography>
                        <Row>
                            {user?.password.edit ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="16px"
                                    width="100%"
                                >
                                    <TextField
                                        label="Password"
                                        value={inputCurrPassword.value}
                                        onChange={
                                            inputCurrPassword.onChangeHandler
                                        }
                                        onBlur={inputCurrPassword.onBlurHandler}
                                        error={
                                            inputCurrPassword.validation.error
                                        }
                                        helperText={
                                            inputCurrPassword.validation.message
                                        }
                                        type="password"
                                        fullWidth={true}
                                    />
                                    <TextField
                                        label="New Password"
                                        value={inputPassword.value}
                                        onChange={inputPassword.onChangeHandler}
                                        onBlur={inputPassword.onBlurHandler}
                                        error={inputPassword.validation.error}
                                        helperText={
                                            inputPassword.validation.message
                                        }
                                        type="password"
                                        fullWidth={true}
                                    />
                                    <TextField
                                        label="Confirm Your Password"
                                        value={inputPasswordConfirm.value}
                                        onChange={
                                            inputPasswordConfirm.onChangeHandler
                                        }
                                        onBlur={
                                            inputPasswordConfirm.onBlurHandler
                                        }
                                        error={
                                            inputPasswordConfirm.validation
                                                .error
                                        }
                                        helperText={
                                            inputPasswordConfirm.validation
                                                .message
                                        }
                                        type="password"
                                        fullWidth={true}
                                    />
                                    <ButtonGroup sx={{ width: '100%' }}>
                                        <Button
                                            onClick={clickSaveHandler}
                                            disabled={
                                                inputCurrPassword.validation
                                                    .error ||
                                                !inputCurrPassword.validation
                                                    .touched ||
                                                inputPassword.validation
                                                    .error ||
                                                !inputPassword.validation
                                                    .touched ||
                                                inputPasswordConfirm.validation
                                                    .error ||
                                                !inputPasswordConfirm.validation
                                                    .touched ||
                                                isLoading.update
                                            }
                                            data-type="password"
                                        >
                                            {isLoading.update ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                'Save'
                                            )}
                                        </Button>
                                        <Button
                                            data-type="password"
                                            onClick={clickEditHandler}
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
                            {!user?.password.edit && (
                                <IconButton
                                    onClick={clickEditHandler}
                                    data-type="password"
                                >
                                    <EditOutlined />
                                </IconButton>
                            )}
                        </Row>
                    </Wrapper>
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
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
                                isLoading={isLoading.update}
                                onSave={(address, closeModal) => {
                                    //1) Update addresses with new address
                                    const updatedAddresses = user.addresses.map(
                                        (currAddr) => {
                                            if (currAddr._id === address._id)
                                                return address
                                            return currAddr
                                        }
                                    )

                                    //2) Prepare form data with new addresses
                                    const formData = new FormData()
                                    updatedAddresses.map((addr, i) => {
                                        formData.append(
                                            `addresses[${i}]['full_name']`,
                                            addr.full_name
                                        )
                                        formData.append(
                                            `addresses[${i}]['phone_no']`,
                                            addr.phone_no
                                        )
                                        formData.append(
                                            `addresses[${i}]['country']`,
                                            addr.country
                                        )
                                        formData.append(
                                            `addresses[${i}]['state']`,
                                            addr.state
                                        )
                                        formData.append(
                                            `addresses[${i}]['city']`,
                                            addr.city
                                        )
                                        formData.append(
                                            `addresses[${i}]['address']`,
                                            addr.address
                                        )
                                        formData.append(
                                            `addresses[${i}]['zip_code']`,
                                            addr.zip_code
                                        )
                                        formData.append(
                                            `addresses[${i}]['property_type']`,
                                            addr.property_type
                                        )
                                        formData.append(
                                            `addresses[${i}]['default_billing_address']`,
                                            JSON.stringify(
                                                addr.default_billing_address
                                            )
                                        )
                                        formData.append(
                                            `addresses[${i}]['default_shipping_address']`,
                                            JSON.stringify(
                                                addr.default_shipping_address
                                            )
                                        )
                                    })

                                    //3) Dispatch action to update current user
                                    dispatch(
                                        updateCurrentUserAsync({
                                            formData,
                                            cb: (updateduser) => {
                                                setShowAlert(true)
                                                updateduser &&
                                                    dispatch(
                                                        setAuthUser(updateduser)
                                                    )
                                                closeModal()
                                            },
                                        })
                                    )
                                }}
                            />
                        )
                    })}
                </TabPanel>
            </Stack>
        </ProfileStyled>
    )
}

export default Profile
