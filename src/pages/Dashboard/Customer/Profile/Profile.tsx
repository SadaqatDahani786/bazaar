import { SyntheticEvent, useEffect, useState } from 'react'

import { EditOutlined, PhotoCamera } from '@mui/icons-material'
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    IconButton,
    MenuItem,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { getCountriesAsync } from '../../../../store/locationReducer'
import { useAppDispatch, useAppSelector } from '../../../../store/store'

//Components
import AddressView from '../../../../components/AddressView'

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
 ** Component [Profile]
 ** ======================================================
 */
const Profile = () => {
    /*
     ** **
     ** ** ** Dummy Data
     ** **
     */
    const [user, setUser] = useState({
        name: { value: 'Sadaqat Dahani', edit: false },
        username: { value: 'sadaqatdahani786', edit: false },
        email: { value: 'sadaqat.dahani2013@gmail.com', edit: false },
        bio: {
            value: "Hey, there! I'm Sadaqat - a MERN full stack developer and a freelancer.",
            edit: false,
        },
        photo: {
            url: 'https://pbs.twimg.com/profile_images/1386009845829099528/8edFUtNp_400x400.jpg',
            name: 'my image',
        },
        password: { value: '**************', edit: false },
        addresses: [
            {
                full_name: 'My home address',
                phone_no: { value: '+923353023372', edit: false },
                address: '23rd street, 5th avenue.',
                country: 'Pakistan',
                state: 'Sindh',
                city: 'Karachi',
                zip_code: '44568',
                property_type: 'other',
                default_shipping_address: true,
                default_billing_address: true,
            },
        ],
    })

    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const countries = useAppSelector((state) => state.location.data)
    const dispatch = useAppDispatch()

    //State
    const [selectedCountryCode, setSelectedCountryCode] = useState('select')

    //Theme
    const theme = useTheme()

    //Tab
    const [activeTab, setActiveTab] = useState(0)
    const tabs = ['Personal Information', 'Account Information', 'Addresses']

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch all countries when components loads first time
    useEffect(() => {
        dispatch(getCountriesAsync())
    }, [])

    //Set country code
    useEffect(() => {
        if (countries.length <= 0) return

        const countryCode = splitNumberByCode(
            user.addresses.find((addr) => addr.default_billing_address)
                ?.phone_no.value
        ).country_code.substring(1)

        if (!countryCode) return

        setSelectedCountryCode(countryCode)
    }, [countries])

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Photo
    const inputProfilePhoto = useUpload({
        default_value: [{ name: user.photo.name, url: user.photo.url }],
    })

    //Name
    const inputName = useInput({
        default_value: user.name.value,
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
        default_value: splitNumberByCode(
            user.addresses.find((addr) => addr.default_billing_address)
                ?.phone_no.value
        ).number,
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
        default_value: user.bio.value,
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
        default_value: user.username.value,
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
        default_value: user.email.value,
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

    /**
     ** **
     ** ** ** Methods
     ** **
     */
    //Click edit handler
    const clickEditHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
        //1) Get type
        const type = e.currentTarget.dataset.type as
            | 'name'
            | 'phone_no'
            | 'bio'
            | 'username'
            | 'email'
            | 'password'
            | undefined

        //2) Check for each type and do the action for it
        if (type === 'name') {
            setUser((state) => ({
                ...state,
                name: { value: state.name.value, edit: !state.name.edit },
            }))
            inputName.reset(true)
        } else if (type === 'phone_no') {
            setUser((state) => ({
                ...state,
                addresses: state.addresses.map((addr) => {
                    if (addr.default_billing_address)
                        return {
                            ...addr,
                            phone_no: {
                                value: addr.phone_no.value,
                                edit: !addr.phone_no.edit,
                            },
                        }

                    return addr
                }),
            }))
            inputPhoneNumber.reset(true)
        } else if (type === 'bio') {
            setUser((state) => ({
                ...state,
                bio: { value: state.bio.value, edit: !state.bio.edit },
            }))
            inputBio.reset(true)
        } else if (type === 'username') {
            setUser((state) => ({
                ...state,
                username: {
                    value: state.username.value,
                    edit: !state.username.edit,
                },
            }))
            inputUsername.reset(true)
        } else if (type === 'email') {
            setUser((state) => ({
                ...state,
                email: {
                    value: state.email.value,
                    edit: !state.email.edit,
                },
            }))
            inputEmail.reset(true)
        } else if (type === 'password') {
            setUser((state) => ({
                ...state,
                password: {
                    value: state.password.value,
                    edit: !state.password.edit,
                },
            }))
            inputPassword.reset(false)
            inputCurrPassword.reset(false)
            inputPasswordConfirm.reset(false)
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
                                    inputProfilePhoto.value.length > 0
                                        ? inputProfilePhoto.value[0].url
                                        : ''
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
                    </Row>
                </Wrapper>
                <Wrapper>
                    <Typography variant="subtitle1" color="GrayText">
                        Full Name
                    </Typography>
                    <Row>
                        {user.name.edit ? (
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
                                    helperText={inputName.validation.message}
                                    fullWidth={true}
                                />
                                <ButtonGroup sx={{ width: '100%' }}>
                                    <Button
                                        disabled={inputName.validation.error}
                                    >
                                        Save
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
                                {user.name.value}
                            </Typography>
                        )}
                        {!user.name.edit && (
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
                        {user.addresses.find(
                            (addr) => addr.default_billing_address
                        )?.phone_no.edit ? (
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
                                        sx={{ flex: '0 0 108px !important' }}
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
                                        onBlur={inputPhoneNumber.onBlurHandler}
                                        error={
                                            inputPhoneNumber.validation.error
                                        }
                                        helperText={
                                            inputPhoneNumber.validation.message
                                        }
                                        fullWidth={true}
                                    />
                                </Row>
                                <ButtonGroup sx={{ width: '100%' }}>
                                    <Button
                                        disabled={
                                            inputPhoneNumber.validation.error
                                        }
                                    >
                                        Save
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
                                {
                                    user.addresses.find(
                                        (addr) => addr.default_billing_address
                                    )?.phone_no.value
                                }
                            </Typography>
                        )}
                        {!user.name.edit && (
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
                        {user.bio.edit ? (
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
                                        disabled={inputBio.validation.error}
                                    >
                                        Save
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
                                {user.bio.value}
                            </Typography>
                        )}
                        {!user.name.edit && (
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
                        {user.username.edit ? (
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
                                        disabled={
                                            inputUsername.validation.error
                                        }
                                    >
                                        Save
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
                                {user.username.value}
                            </Typography>
                        )}
                        {!user.username.edit && (
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
                        {user.email.edit ? (
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
                                    helperText={inputEmail.validation.message}
                                    fullWidth={true}
                                />
                                <ButtonGroup sx={{ width: '100%' }}>
                                    <Button
                                        disabled={inputEmail.validation.error}
                                    >
                                        Save
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
                                {user.email.value}
                            </Typography>
                        )}
                        {!user.email.edit && (
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
                        {user.password.edit ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                gap="16px"
                                width="100%"
                            >
                                <TextField
                                    label="Password"
                                    value={inputCurrPassword.value}
                                    onChange={inputCurrPassword.onChangeHandler}
                                    onBlur={inputCurrPassword.onBlurHandler}
                                    error={inputCurrPassword.validation.error}
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
                                    onBlur={inputPasswordConfirm.onBlurHandler}
                                    error={
                                        inputPasswordConfirm.validation.error
                                    }
                                    helperText={
                                        inputPasswordConfirm.validation.message
                                    }
                                    type="password"
                                    fullWidth={true}
                                />
                                <ButtonGroup sx={{ width: '100%' }}>
                                    <Button
                                        disabled={
                                            inputCurrPassword.validation
                                                .error ||
                                            !inputCurrPassword.validation
                                                .touched ||
                                            inputPassword.validation.error ||
                                            !inputPassword.validation.touched ||
                                            inputPasswordConfirm.validation
                                                .error ||
                                            !inputPasswordConfirm.validation
                                                .touched
                                        }
                                    >
                                        Save
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
                                {user.password.value}
                            </Typography>
                        )}
                        {!user.password.edit && (
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
                {user.addresses.map((addr) => {
                    const addrUpd = {
                        ...addr,
                        phone_no: addr.phone_no.value,
                        property_type: addr.property_type as
                            | 'house'
                            | 'apartment'
                            | 'business'
                            | 'other',
                    }
                    return (
                        <AddressView
                            key={addr.phone_no.value}
                            address={addrUpd}
                            mode="EDIT"
                        />
                    )
                })}
            </TabPanel>
        </ProfileStyled>
    )
}

export default Profile
