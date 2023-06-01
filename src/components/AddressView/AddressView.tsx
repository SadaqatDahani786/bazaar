import { SyntheticEvent, useEffect, useRef, useState } from 'react'

import {
    AddOutlined,
    ApartmentOutlined,
    CreditCardOutlined,
    DeleteOutline,
    EditOutlined,
    Help,
    HomeOutlined,
    HouseOutlined,
    LocationOnOutlined,
    NotListedLocation,
    SmartphoneOutlined,
    Store,
} from '@mui/icons-material'
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    MenuItem,
    Modal,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import {
    getCitiesInStateAsync,
    getCountriesAsync,
    getStatesInCountryAsync,
} from '../../store/locationReducer'

//Components
import Pill from '../Pill'

//Hooks & Func
import useInput from '../../hooks/useInput'
import { splitNumberByCode } from '../../utils/splitNumberByCode'
import {
    combineValidators,
    isAlpha,
    isAlphaNumeric,
    isEmpty,
    isPhoneNumber,
    isZipCode,
} from '../../utils/validators'
import isCountryHasStates from '../../utils/isCountryHasStates'
import isStateHasCities from '../../utils/isStateHasCities'
import { toCapitalize } from '../../utils/toCapitalize'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Address View
const AddressViewStyled = styled.div`
    width: 100%;
    height: max-content;
`

const AddressViewInnerWrapper = styled.div`
    width: 100%;
    height: max-content;
    padding: 16px;
    border: 1px solid ${(props) => props.theme.palette.grey['400']};
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 4px;

    & > :nth-child(1) {
        padding-bottom: 16px;
    }
`

//Edit View
const EditView = styled.div`
    border-radius: 16px;
    width: 800px;
    min-height: 90vh;
    background: ${(props) => props.theme.palette.secondary.main};
    padding: 24px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 32px;

    & > div {
        padding: 16px 0;
    }
`

/**
 ** ======================================================
 ** Type [PropertyType]
 ** ======================================================
 */
export type PropertyType = 'house' | 'apartment' | 'business' | 'other'

/**
 ** ======================================================
 ** Interface [IAddress]
 ** ======================================================
 */
export interface IAddress {
    _id: string
    full_name: string
    phone_no: string
    country: string
    state: string
    city: string
    address: string
    zip_code: string
    property_type: PropertyType
    default_shipping_address: boolean
    default_billing_address: boolean
}

/**
 ** ======================================================
 ** Interace [AddressViewProps]
 ** ======================================================
 */
interface AddressViewProps {
    address?: IAddress
    onSave?: (address: IAddress, closeModal: () => void) => void
    onDelete?: (address: IAddress) => void
    mode?: 'EDIT' | 'ADD_NEW'
    isLoading?: boolean
}

/**
 ** ======================================================
 ** Component [AddressView]
 ** ======================================================
 */
const AddressView = ({
    mode = 'ADD_NEW',
    isLoading = false,
    onDelete,
    address = {
        _id: '',
        address: '',
        city: 'select',
        country: 'select',
        state: 'select',
        full_name: '',
        default_billing_address: false,
        default_shipping_address: false,
        phone_no: '',
        property_type: 'house',
        zip_code: '',
    },
    onSave = () => '',
}: AddressViewProps) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const countries = useAppSelector((state) => state.location.data)
    const dispatch = useAppDispatch()

    //State
    const [showModal, setShowModal] = useState(false)

    //Selects
    const [selectedCountryCode, setSelectedCountryCode] = useState('select')
    const [selectedCountry, setSelectedCountry] = useState('select')
    const [selectedState, setSelectedState] = useState('select')
    const [selectedCity, setSelectedCity] = useState('select')
    const [selectedPropertyType, setSelectedPropertyType] =
        useState<PropertyType>(address.property_type)

    //Defaults Address
    const [isDefaultShippingAddress, setIsDefaultShippingAddress] = useState(
        address.default_shipping_address
    )
    const [isDefaultBillingAddress, setIsDefaultBillingAddress] = useState(
        address.default_billing_address
    )

    //Theme
    const theme = useTheme()

    //Refs
    const refInputFullName = useRef<HTMLInputElement>(null)
    const refInputCountryCode = useRef<HTMLInputElement>(null)
    const refInputPhoneNumber = useRef<HTMLInputElement>(null)

    const refInputCountry = useRef<HTMLInputElement>(null)
    const refInputState = useRef<HTMLInputElement>(null)
    const refInputCity = useRef<HTMLInputElement>(null)

    const refInputAddress = useRef<HTMLInputElement>(null)
    const refInputZipCode = useRef<HTMLInputElement>(null)

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Full Name
    const inputFullName = useInput({
        default_value: address.full_name,
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Enter full name for an address.',
            },
            {
                validator: isAlpha,
                message:
                    'Full name must only include letters and whitespace. No special characters are allowed.',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                },
            },
        ]),
    })

    //Phone number
    const inputPhoneNumber = useInput({
        default_value: splitNumberByCode(address.phone_no).number,
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Enter phone number for an address.',
            },
            {
                validator: isPhoneNumber,
                message: 'Please provide a valid phone number.',
            },
        ]),
    })

    //Zip code
    const inputZipCode = useInput({
        default_value: address.zip_code,
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Enter zip code for an address.',
            },
            {
                validator: isZipCode,
                message: 'Please provide a valid zip code.',
            },
        ]),
    })

    //Address
    const inputAddress = useInput({
        default_value: address.address,
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Enter full address.',
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

    //Click select property type handler
    const clickSelectPropertyTypeHandler = (
        e: SyntheticEvent<HTMLButtonElement>
    ) => {
        //1) Get type
        const type = e.currentTarget.dataset.type as PropertyType

        //2) Validate
        if (!type) return

        //3) Set property type
        setSelectedPropertyType(type)
    }

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch countries, states and cities of default address
    useEffect(() => {
        //=> Don't run when going to become visible
        if (showModal) return

        //=> Dispatch countries
        dispatch(
            getCountriesAsync(() => {
                setSelectedCountryCode(
                    splitNumberByCode(address.phone_no).country_code.substring(
                        1
                    )
                )
                //=> set country
                setSelectedCountry(toCapitalize(address.country))

                //=> dispatch states
                dispatch(
                    getStatesInCountryAsync({
                        country: toCapitalize(address.country),
                        cb: () => {
                            //=> set state
                            setSelectedState(toCapitalize(address.state))

                            //=> dispatch cities
                            dispatch(
                                getCitiesInStateAsync({
                                    country: toCapitalize(address.country),
                                    state: toCapitalize(address.state),
                                    cb() {
                                        //=> set citiy
                                        setSelectedCity(
                                            toCapitalize(address.city)
                                        )
                                    },
                                })
                            )
                        },
                    })
                )
            })
        )
    }, [showModal])

    //Refetch states when country changes
    useEffect(() => {
        //1) Validate
        if (!selectedCountry || selectedCountry === 'select') return

        //2) Default
        setSelectedState('select')
        setSelectedCity('select')

        //3) Fetch
        dispatch(getStatesInCountryAsync({ country: selectedCountry }))
    }, [selectedCountry])

    //Refetch cities when states changes
    useEffect(() => {
        //1) Validate
        if (!selectedState || selectedState === 'select') return

        //2) Default
        setSelectedCity('select')

        //3) Fetch
        dispatch(
            getCitiesInStateAsync({
                country: selectedCountry,
                state: selectedState,
            })
        )
    }, [selectedState])

    /*
     ** **
     ** ** ** Methods
     ** **
     */

    //Click save handler
    const clickSaveHandler = () => {
        //1) Trigger validation of inputs
        inputFullName.validation.validate()
        inputPhoneNumber.validation.validate()
        inputAddress.validation.validate()
        inputZipCode.validation.validate()

        //2) Focus on invalid input fields
        if (
            inputFullName.validation.error ||
            !inputFullName.validation.touched
        ) {
            return refInputFullName.current?.focus()
        } else if (selectedCountryCode === 'select') {
            return refInputCountryCode.current?.focus()
        } else if (
            inputPhoneNumber.validation.error ||
            !inputPhoneNumber.validation.touched
        ) {
            return refInputPhoneNumber.current?.focus()
        } else if (!selectedCountry || selectedCountry === 'select') {
            return refInputCountry.current?.focus()
        } else if (
            isCountryHasStates(countries, selectedCountry) &&
            (!selectedState || selectedState === 'select')
        ) {
            return refInputState.current?.focus()
        } else if (
            isStateHasCities(countries, selectedCountry, selectedState) &&
            (!selectedCity || selectedCity === 'select')
        ) {
            return refInputCity.current?.focus()
        } else if (
            inputAddress.validation.error ||
            !inputAddress.validation.touched
        ) {
            return refInputAddress.current?.focus()
        } else if (
            inputZipCode.validation.error ||
            !inputZipCode.validation.touched
        ) {
            return refInputZipCode.current?.focus()
        }

        //3) No errors, proceed with updating address
        onSave(
            {
                ...address,
                full_name: inputFullName.value,
                phone_no: '+' + selectedCountryCode + inputPhoneNumber.value,
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
                address: inputAddress.value,
                zip_code: inputZipCode.value,
                property_type: selectedPropertyType,
                default_billing_address: isDefaultBillingAddress,
                default_shipping_address: isDefaultShippingAddress,
            },
            () => {
                setShowModal(false)
            }
        )

        //4) Reset input
        clickCancelHandler()
    }

    //Click cancel handler
    const clickCancelHandler = () => {
        const isModeEdit = mode === 'EDIT'

        //1) Reset all inputs
        inputFullName.reset(isModeEdit)
        inputPhoneNumber.reset(isModeEdit)
        inputAddress.reset(isModeEdit)
        inputZipCode.reset(isModeEdit)

        //2) Reset all select inputs
        setSelectedPropertyType(address.property_type)
        setIsDefaultBillingAddress(address.default_billing_address)
        setIsDefaultShippingAddress(address.default_shipping_address)

        //3) Hide modal
        setShowModal(false)
    }

    return (
        <AddressViewStyled>
            {mode === 'ADD_NEW' ? (
                <Box sx={{ alignSelf: 'flex-end' }}>
                    <Tooltip title="Add new address">
                        <IconButton
                            onClick={() => setShowModal(true)}
                            size="large"
                        >
                            <AddOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : (
                <AddressViewInnerWrapper>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                    >
                        <Stack flex={1}>
                            <Typography
                                textAlign="left"
                                color="text.secondary"
                                fontWeight="bold"
                                variant="h6"
                            >
                                {address.full_name}
                            </Typography>
                        </Stack>
                        <Stack flexDirection="row" gap="8px">
                            <Box>
                                <Tooltip title="Edit">
                                    <IconButton
                                        onClick={() => setShowModal(true)}
                                    >
                                        <EditOutlined fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {!address.default_billing_address &&
                            !address.default_shipping_address ? (
                                <Box>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            onClick={() =>
                                                onDelete && onDelete(address)
                                            }
                                        >
                                            <DeleteOutline fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ) : (
                                ' '
                            )}
                        </Stack>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                    >
                        <SmartphoneOutlined
                            sx={{ color: theme.palette.grey[800] }}
                            fontSize="small"
                        />
                        <Typography color="GrayText">
                            {address.phone_no}
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                    >
                        <LocationOnOutlined
                            sx={{ color: theme.palette.grey[800] }}
                            fontSize="small"
                        />
                        <Typography color="GrayText">
                            {address.address}
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                    >
                        <Pill
                            startIcon={
                                address.property_type === 'house' ? (
                                    <HouseOutlined />
                                ) : address.property_type === 'apartment' ? (
                                    <ApartmentOutlined />
                                ) : address.property_type === 'business' ? (
                                    <Store />
                                ) : (
                                    <NotListedLocation />
                                )
                            }
                            color="info"
                            text={
                                address.property_type
                                    .substring(0, 1)
                                    .toUpperCase() +
                                address.property_type.substring(1)
                            }
                        />
                        {address.default_billing_address && (
                            <Pill
                                startIcon={<CreditCardOutlined />}
                                color="success"
                                text="Default Billing Address"
                            />
                        )}
                        {address.default_shipping_address && (
                            <Pill
                                startIcon={<HomeOutlined />}
                                color="error"
                                text="Default Shipping Address"
                            />
                        )}
                    </Stack>
                </AddressViewInnerWrapper>
            )}
            <Modal
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                open={showModal}
                onClose={() => setShowModal(false)}
            >
                <EditView>
                    <Typography variant="h5">
                        {mode === 'ADD_NEW' ? 'Add New' : 'Edit'} Address
                    </Typography>
                    <Stack gap="16px">
                        <Stack>
                            <TextField
                                label="Full Name"
                                value={inputFullName.value}
                                onChange={inputFullName.onChangeHandler}
                                onBlur={inputFullName.onBlurHandler}
                                error={inputFullName.validation.error}
                                helperText={inputFullName.validation.message}
                                inputRef={refInputFullName}
                                fullWidth={true}
                            />
                        </Stack>
                        <Stack
                            flexDirection="row"
                            spacing={1}
                            alignItems="baseline"
                        >
                            <TextField
                                label="Country Code"
                                sx={{
                                    width: '124px',
                                }}
                                select
                                value={selectedCountryCode}
                                onChange={(e) =>
                                    setSelectedCountryCode(e.target.value)
                                }
                                inputRef={refInputCountryCode}
                            >
                                <MenuItem disabled={true} value="select">
                                    Select Code
                                </MenuItem>
                                {countries.map((country, i) => (
                                    <MenuItem
                                        key={i}
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
                                value={inputPhoneNumber.value}
                                onChange={inputPhoneNumber.onChangeHandler}
                                onBlur={inputPhoneNumber.onBlurHandler}
                                error={inputPhoneNumber.validation.error}
                                helperText={inputPhoneNumber.validation.message}
                                inputRef={refInputPhoneNumber}
                                fullWidth={true}
                            />
                        </Stack>
                        <Stack
                            flexDirection="row"
                            justifyContent="stretch"
                            gap="8px"
                        >
                            <TextField
                                label="Country"
                                fullWidth={true}
                                value={selectedCountry}
                                onChange={(e) =>
                                    setSelectedCountry(e.target.value)
                                }
                                select
                                inputRef={refInputCountry}
                            >
                                <MenuItem disabled={true} value="select">
                                    Select Country
                                </MenuItem>
                                {countries.map((country, i) => (
                                    <MenuItem key={i} value={country.name}>
                                        {country.emoji + ' ' + country.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="State/Province"
                                fullWidth={true}
                                select
                                value={selectedState}
                                onChange={(e) =>
                                    setSelectedState(e.target.value)
                                }
                                inputRef={refInputState}
                            >
                                <MenuItem disabled={true} value="select">
                                    Select State/Province
                                </MenuItem>
                                {countries
                                    .find(
                                        (country) =>
                                            country.name === selectedCountry
                                    )
                                    ?.states.map((state, i) => (
                                        <MenuItem key={i} value={state.name}>
                                            {state.name}
                                        </MenuItem>
                                    )) || ''}
                            </TextField>
                            <TextField
                                label="City/District"
                                fullWidth={true}
                                select
                                value={selectedCity}
                                onChange={(e) =>
                                    setSelectedCity(e.target.value)
                                }
                                inputRef={refInputCity}
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
                                    ?.cities.map((city, i) => (
                                        <MenuItem key={i} value={city.name}>
                                            {city.name}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Stack>
                        <Stack
                            flexDirection="row"
                            spacing={1}
                            alignItems="baseline"
                        >
                            <TextField
                                label="Address"
                                value={inputAddress.value}
                                onChange={inputAddress.onChangeHandler}
                                onBlur={inputAddress.onBlurHandler}
                                error={inputAddress.validation.error}
                                helperText={inputAddress.validation.message}
                                inputRef={refInputAddress}
                                fullWidth={true}
                            />
                        </Stack>
                        <Stack
                            flexDirection="row"
                            gap="16px"
                            alignItems="baseline"
                        >
                            <TextField
                                label="Zip Code"
                                value={inputZipCode.value}
                                onChange={inputZipCode.onChangeHandler}
                                onBlur={inputZipCode.onBlurHandler}
                                error={inputZipCode.validation.error}
                                helperText={inputZipCode.validation.message}
                                inputRef={refInputZipCode}
                                fullWidth={true}
                            />
                            <ButtonGroup disableElevation={true}>
                                <Button
                                    data-type="house"
                                    onClick={clickSelectPropertyTypeHandler}
                                    variant={
                                        selectedPropertyType === 'house'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                >
                                    House
                                </Button>
                                <Button
                                    data-type="apartment"
                                    onClick={clickSelectPropertyTypeHandler}
                                    variant={
                                        selectedPropertyType === 'apartment'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                >
                                    Apartment
                                </Button>
                                <Button
                                    data-type="business"
                                    onClick={clickSelectPropertyTypeHandler}
                                    variant={
                                        selectedPropertyType === 'business'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                >
                                    Business
                                </Button>
                                <Button
                                    data-type="other"
                                    onClick={clickSelectPropertyTypeHandler}
                                    variant={
                                        selectedPropertyType === 'other'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                >
                                    Other
                                </Button>
                            </ButtonGroup>
                        </Stack>
                        <Stack>
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                gap="8px"
                            >
                                <FormControlLabel
                                    disabled={address.default_shipping_address}
                                    sx={{ width: 'max-content' }}
                                    control={
                                        <Checkbox
                                            checked={isDefaultShippingAddress}
                                            onChange={() =>
                                                setIsDefaultShippingAddress(
                                                    (state) => !state
                                                )
                                            }
                                        />
                                    }
                                    label="Default Shipping Address"
                                />
                                {address.default_shipping_address && (
                                    <Tooltip title="To turn off default address, please set another address to default.">
                                        <Help fontSize="small" />
                                    </Tooltip>
                                )}
                            </Stack>
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                gap="8px"
                            >
                                <FormControlLabel
                                    disabled={address.default_billing_address}
                                    sx={{ width: 'max-content' }}
                                    control={
                                        <Checkbox
                                            checked={isDefaultBillingAddress}
                                            onChange={() =>
                                                setIsDefaultBillingAddress(
                                                    (state) => !state
                                                )
                                            }
                                        />
                                    }
                                    label="Default Billing Address"
                                />
                                {address.default_billing_address && (
                                    <Tooltip title="To turn off default address, please set another address to default.">
                                        <Help fontSize="small" />
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack marginTop="auto" flexDirection="row" gap="16px">
                        <Button
                            disabled={isLoading}
                            disableElevation={true}
                            size="large"
                            variant="contained"
                            sx={{ padding: '12px 0', width: '148px' }}
                            onClick={clickSaveHandler}
                        >
                            {isLoading ? (
                                <CircularProgress size={16} />
                            ) : (
                                'Save'
                            )}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ padding: '12px 0', width: '148px' }}
                            onClick={clickCancelHandler}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </EditView>
            </Modal>
        </AddressViewStyled>
    )
}

export default AddressView
