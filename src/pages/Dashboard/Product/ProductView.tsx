import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react'

import {
    CheckOutlined,
    ClearOutlined,
    EuroOutlined,
    ExpandMoreOutlined,
} from '@mui/icons-material'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    InputAdornment,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'

import styled from 'styled-components'
import { Link } from 'react-router-dom'

//Redux
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { IMediaDatabase } from '../../../store/mediaReducer'
import {
    editSelectedStatus,
    getManyCategoryAsync,
} from '../../../store/categoryReducer'
import {
    createProductAsync,
    IProduct,
    updateProductAsync,
} from '../../../store/productReducer'

//Components
import MediaPicker from '../../../components/MediaPicker'

//Hooks & Func
import useInput from '../../../hooks/useInput'
import {
    combineValidators,
    isAlphaNumeric,
    IsDecimal,
    isEmpty,
    isMaxLength,
    isMinLength,
    isNumber,
} from '../../../utils/validators'

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
//Add New Product
const AddNewProductStyled = styled.div`
    border: 1px solid black;
    margin: 32px 0;
    display: flex;
`

/**
 ** ======================================================
 ** Interface [ProductViewProps]
 ** ======================================================
 */
interface ProductViewProps {
    mode?: 'ADD_NEW' | 'EDIT'
    product?: IProduct
}

/**
 ** ======================================================
 ** Component [ProductView]
 ** ======================================================
 */
const ProductView = ({ mode = 'ADD_NEW', product }: ProductViewProps) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const { isLoading, errors } = useAppSelector((state) => state.product)
    const categories = useAppSelector((state) => state.category.data)
    const dispatch = useAppDispatch()

    //Data
    const colors = [
        'Aqua',
        'Crimson',
        'Black',
        'Blue',
        'Brown',
        'Gold',
        'Gray',
        'Green',
        'Orange',
        'Pink',
        'Purple',
        'Red',
        'Teal',
        'Violet',
        'White',
        'Yellow',
    ]
    const sizes = ['XS', 'S', 'M', 'L', 'XL']

    //State
    const [showAlert, setShowAlert] = useState(false)
    const [isStaffPiced, setIsStaffPicked] = useState(false)
    const [selectedOption, setSelectedOption] = useState('Custom')
    const [productVariations, setProductVariations] = useState<
        Array<{
            name: string
            variant_type: 'color' | 'size' | 'other'
            terms: Array<{
                name: string
                isSelected?: boolean
                image?: IMediaDatabase
            }>
        }>
    >([])
    const [selectedDate, setSelectedDate] = useState(
        new Date(Date.now()).toISOString().slice(0, 10)
    )
    const [selectedProductImage, setSelectedProductImage] =
        useState<IMediaDatabase>()
    const [selectedProductGallery, setSelectedProductGallery] =
        useState<Array<IMediaDatabase>>()

    //Theme
    const theme = useTheme()

    //Tabs
    const [activeTab, setActiveTab] = useState(0)
    const tabs = [
        'General',
        'Inventory',
        'Variations',
        'Shipping',
        'Categories',
    ]

    //Refs
    const refInputTitle = useRef<HTMLInputElement>(null)
    const refInputDescription = useRef<HTMLInputElement>(null)
    const refInputRegularPrice = useRef<HTMLInputElement>(null)
    const refInputSellingPrice = useRef<HTMLInputElement>(null)
    const refInputBrand = useRef<HTMLInputElement>(null)
    const refInputModelNo = useRef<HTMLInputElement>(null)

    const refInputSku = useRef<HTMLInputElement>(null)
    const refInputStock = useRef<HTMLInputElement>(null)
    const refInputLowStockThreshold = useRef<HTMLInputElement>(null)

    const refInputWeight = useRef<HTMLInputElement>(null)
    const refInputWidth = useRef<HTMLInputElement>(null)
    const refInputHeight = useRef<HTMLInputElement>(null)
    const refInputLength = useRef<HTMLInputElement>(null)

    const clearProductImage = useRef<() => void>()
    const clearProductGallery = useRef<() => void>()

    const touched = useRef(false)

    /*
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Title
    const inputTitle = useInput({
        default_value: mode === 'EDIT' && product ? product?.title : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Give a title to your product',
            },
            {
                validator: isAlphaNumeric,
                message:
                    'Title must only contain letters, numbers, hyphens, dashes or whitespace. No other special characters are allowed. ',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                    ignoreHyphens: true,
                    ignoreDashes: true,
                },
            },
        ]),
    })

    //Description
    const inputDescription = useInput({
        default_value: mode === 'EDIT' && product ? product?.description : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Give a nice description of your product.',
            },
            {
                validator: isAlphaNumeric,
                message:
                    'Description must only contain letters, numbers, whitespaces or puntuation marks, no other special characters are allowed. ',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                    ignorePunctuations: true,
                },
            },
        ]),
    })

    //Regular Price
    const inputRegularPrice = useInput({
        default_value:
            mode === 'EDIT' && product ? product?.price.toString() : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'How much your product cost? Give it a price.',
            },
            {
                validator: IsDecimal,
                message: 'Please enter a valid price.',
            },
        ]),
    })

    //Selling Price
    const inputSellingPrice = useInput({
        default_value:
            mode === 'EDIT' && product ? product?.selling_price.toString() : '',
        validation: combineValidators([
            {
                validator: IsDecimal,
                message: 'Please enter a valid price.',
            },
        ]),
    })

    //Brand
    const inputBrand = useInput({
        default_value:
            mode === 'EDIT' && product
                ? product?.manufacturing_details?.brand
                : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message:
                    "Please enter product's manufacturer/brand of the product.",
            },
            {
                validator: isAlphaNumeric,
                message:
                    'Brand name must only contain letters, numbers or whitespace. ',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                },
            },
        ]),
    })

    //Model Number
    const inputModelNo = useInput({
        default_value:
            mode === 'EDIT' && product
                ? product?.manufacturing_details?.model_number
                : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: "Please enter product's model number.",
            },
            {
                validator: isAlphaNumeric,
                message:
                    'Model number must only contain letters, numbers, hyphens, or whitespaces. ',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                    ignoreHyphens: true,
                },
            },
        ]),
    })

    //Sku
    const inputSku = useInput({
        default_value: mode === 'EDIT' && product ? product?.sku : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: "Please enter product's SKU.",
            },
            {
                validator: isAlphaNumeric,
                message: 'SKU must only contain letters or numbers.',
                options: {
                    ignoreCase: true,
                },
            },
            {
                validator: isMinLength,
                message: 'SKU must be 8 character long.',
                options: {
                    min: 8,
                },
            },
            {
                validator: isMaxLength,
                message: 'SKU must be 8 character long.',
                options: {
                    max: 8,
                },
            },
        ]),
    })

    //Stock
    const inputStock = useInput({
        default_value:
            mode === 'EDIT' && product ? product?.stock.toString() : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: "Please enter product's available stock.",
            },
            {
                validator: isNumber,
                message:
                    "Please provide a valid postive number for product's stock.",
            },
        ]),
    })

    //Low stock threshold
    const inputLowStockThreshold = useInput({
        default_value: mode === 'EDIT' && product ? '0' : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: "Please enter product's low stock threshold.",
            },
            {
                validator: isNumber,
                message:
                    "Please provide a valid postive number for product's low stock threshold.",
            },
        ]),
    })

    //Weight
    const inputWeight = useInput({
        default_value:
            mode === 'EDIT' && product
                ? product?.shipping?.weight.toString()
                : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please provide weight of the product in kg.',
            },
            {
                validator: IsDecimal,
                message: "Please provide a valid number for product's weight.",
            },
        ]),
    })

    //Width
    const inputWidth = useInput({
        default_value:
            mode === 'EDIT' && product
                ? product?.shipping?.dimensions?.width.toString()
                : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please provide width of the product in cm.',
            },
            {
                validator: IsDecimal,
                message: "Please provide a valid number for product's width.",
            },
        ]),
    })

    //Height
    const inputHeight = useInput({
        default_value:
            mode === 'EDIT' && product
                ? product?.shipping?.dimensions?.height.toString()
                : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please provide height of the product in cm.',
            },
            {
                validator: IsDecimal,
                message: "Please provide a valid number for product's height.",
            },
        ]),
    })

    //Lenth
    const inputLength = useInput({
        default_value:
            mode === 'EDIT' && product
                ? product?.shipping?.dimensions?.length.toString()
                : '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Please provide length of the product in cm.',
            },
            {
                validator: IsDecimal,
                message: "Please provide a valid number for product's length.",
            },
        ]),
    })

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch categories
    useEffect(() => {
        dispatch(getManyCategoryAsync([]))
    }, [])

    // Set default product categories
    useEffect(() => {
        if (activeTab !== 0) touched.current = true

        //1) Validate
        if (mode !== 'EDIT') return

        //2) Dispatch action to edit
        dispatch(
            editSelectedStatus({
                ids: product?.categories.map((cat) => cat._id) || [],
                edit: true,
            })
        )
    }, [activeTab])

    //Set default product variations and images
    useEffect(() => {
        //1) Validate
        if (!product || mode !== 'EDIT') return

        //2) Transform
        const productVariantsUpdated = product.variants.map((variant) => {
            if (variant.name === 'Color') {
                return {
                    ...variant,
                    terms: colors.map((color) => ({
                        name: color,
                        isSelected: variant.terms
                            .map((term) => term.name)
                            .includes(color),
                    })),
                }
            } else if (variant.name === 'Size') {
                return {
                    ...variant,
                    terms: sizes.map((size) => ({
                        name: size,
                        isSelected: variant.terms
                            .map((term) => term.name)
                            .includes(size),
                    })),
                }
            } else {
                return {
                    ...variant,
                    terms: variant.terms.map((term) => ({
                        ...term,
                        isSelected: true,
                    })),
                }
            }
        })

        //3) Update variations
        setProductVariations(productVariantsUpdated)

        //4) Set product image and product gallery
        setSelectedProductImage(product.image)
        setSelectedProductGallery(product.image_gallery)

        //5) Set staffpicked
        setIsStaffPicked(product.staff_picked ? true : false)
    }, [product])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Pass reset function to parent component
    const onClearSelection =
        (type: 'Image' | 'Gallery') => (cb: () => void) => {
            type === 'Image'
                ? (clearProductImage.current = cb)
                : (clearProductGallery.current = cb)
        }

    //Click add variation handler
    const clickAddVariationHandler = () => {
        if (selectedOption === 'Color') {
            const upd = [...productVariations]
            upd.push({
                name: 'Color',
                variant_type: 'color',
                terms: colors.map((color) => ({
                    name: color,
                    isSelected: false,
                })),
            })
            setProductVariations(upd)
        } else if (selectedOption === 'Size') {
            const upd = [...productVariations]
            upd.push({
                name: 'Size',
                variant_type: 'size',
                terms: sizes.map((size) => ({ name: size, isSelected: false })),
            })
            setProductVariations(upd)
        } else {
            const upd = [...productVariations]
            upd.push({
                name: '',
                variant_type: 'other',
                terms: [],
            })
            setProductVariations(upd)
        }

        setSelectedOption('Custom')
    }

    //On change input custom variation handler
    const onChangeInputVariationHandler = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        setProductVariations(
            productVariations.map((m, ind) =>
                index === ind
                    ? {
                          ...m,
                          name:
                              e.target.value === 'Color' ||
                              e.target.value === 'Size'
                                  ? `${e.target.value}(Custom)`
                                  : e.target.value,
                      }
                    : m
            )
        )
    }

    //On change variation size/color selection handler
    const onChangeVariationSelectionHandler = (
        e: SyntheticEvent<Element, Event>,
        val: Array<string>,
        type: 'Color' | 'Size'
    ) => {
        setProductVariations(
            productVariations.map((prodVar) => {
                if (prodVar.name === type) {
                    return {
                        ...prodVar,
                        terms: prodVar.terms.map((term) => {
                            return val.includes(term.name)
                                ? {
                                      ...term,
                                      isSelected: true,
                                  }
                                : {
                                      ...term,
                                      isSelected: false,
                                  }
                        }),
                    }
                }
                return prodVar
            })
        )
    }

    //Click reset handler
    const clickResetHandler = () => {
        //1) Clear inputs
        inputTitle.reset(false)
        inputDescription.reset(false)
        inputRegularPrice.reset(false)
        inputSellingPrice.reset(false)
        inputBrand.reset(false)
        inputModelNo.reset(false)
        inputSku.reset(false)
        inputStock.reset(false)
        inputLowStockThreshold.reset(false)
        inputWeight.reset(false)
        inputWidth.reset(false)
        inputHeight.reset(false)
        inputLength.reset(false)

        //2) Clear selected fields
        setSelectedDate(new Date(Date.now()).toISOString().slice(0, 10))
        setIsStaffPicked(false)
        setProductVariations([])
        dispatch(
            editSelectedStatus({
                ids: categories.map((cat) => cat._id),
                edit: false,
            })
        )

        //3) Clear images
        setSelectedProductImage(undefined)
        setSelectedProductGallery(undefined)
        clearProductImage.current && clearProductImage.current()
        clearProductGallery.current && clearProductGallery.current()

        //4) Set active tab to the start
        setActiveTab(0)
    }

    //Click action handler
    const clickActionHandler = () => {
        //1) Hide alert
        setShowAlert(false)

        //2) Trigger Validation
        inputTitle.validation.validate()
        inputDescription.validation.validate()
        inputRegularPrice.validation.validate()
        inputSellingPrice.validation.validate()
        inputBrand.validation.validate()
        inputModelNo.validation.validate()

        inputSku.validation.validate()
        inputStock.validation.validate()
        inputLowStockThreshold.validation.validate()

        inputWeight.validation.validate()
        inputWidth.validation.validate()
        inputHeight.validation.validate()
        inputLength.validation.validate()

        //3) Focus on invalid field
        if (inputTitle.validation.error || !inputTitle.validation.touched) {
            setActiveTab(0)
            return refInputTitle.current?.focus()
        } else if (
            inputDescription.validation.error ||
            !inputDescription.validation.touched
        ) {
            setActiveTab(0)
            return refInputDescription.current?.focus()
        } else if (
            inputRegularPrice.validation.error ||
            !inputRegularPrice.validation.touched
        ) {
            setActiveTab(0)
            return refInputRegularPrice.current?.focus()
        } else if (inputSellingPrice.validation.error) {
            setActiveTab(0)
            return refInputSellingPrice.current?.focus()
        } else if (
            inputBrand.validation.error ||
            !inputBrand.validation.touched
        ) {
            setActiveTab(0)
            return refInputBrand.current?.focus()
        } else if (
            inputModelNo.validation.error ||
            !inputModelNo.validation.touched
        ) {
            setActiveTab(0)
            return refInputModelNo.current?.focus()
        } else if (inputSku.validation.error || !inputSku.validation.touched) {
            setActiveTab(1)
            return refInputSku.current?.focus()
        } else if (
            inputStock.validation.error ||
            !inputStock.validation.touched
        ) {
            setActiveTab(1)
            return refInputStock.current?.focus()
        } else if (
            inputLowStockThreshold.validation.error ||
            !inputLowStockThreshold.validation.touched
        ) {
            setActiveTab(1)
            return refInputLowStockThreshold.current?.focus()
        } else if (
            inputWeight.validation.error ||
            !inputWeight.validation.touched
        ) {
            setActiveTab(3)
            return refInputWeight.current?.focus()
        } else if (
            inputWidth.validation.error ||
            !inputWidth.validation.touched
        ) {
            setActiveTab(3)
            return refInputWidth.current?.focus()
        } else if (
            inputHeight.validation.error ||
            !inputHeight.validation.touched
        ) {
            setActiveTab(3)
            return refInputHeight.current?.focus()
        } else if (
            inputLength.validation.error ||
            !inputLength.validation.touched
        ) {
            setActiveTab(3)
            return refInputLength.current?.focus()
        }

        //4) No error, proceed with creating form data
        const formData = new FormData()

        //=> General
        formData.append('title', inputTitle.value)
        formData.append('description', inputDescription.value)
        formData.append('price', inputRegularPrice.value)
        formData.append('selling_price', inputSellingPrice.value)
        formData.append('staff_picked', isStaffPiced ? 'true' : 'false')

        //=> Images
        if (selectedProductImage)
            formData.append('image', selectedProductImage._id)
        if (selectedProductGallery)
            formData.append(
                `image_gallery`,
                JSON.stringify(selectedProductGallery.map((img) => img._id))
            )

        //=> Manufacturing
        formData.append('manufacturing_details[brand]', inputBrand.value)
        formData.append(
            'manufacturing_details[model_number]',
            inputModelNo.value
        )
        formData.append('manufacturing_details[release_date]', selectedDate)

        //=> Inventory
        formData.append('sku', inputSku.value)
        formData.append('stock', inputStock.value)
        formData.append('low_stock_threshold', inputLowStockThreshold.value)

        //=> Variations
        const variants = productVariations
            .filter(
                (prodVar) =>
                    prodVar.name.trim() !== '' || prodVar.terms.length > 0
            )
            .map((variant) => ({
                ...variant,
                terms: variant.terms
                    .filter((term) => term.isSelected)
                    .map((term) => ({
                        ...term,
                        image: term.image?._id || undefined,
                    })),
            }))
        formData.append('variants', JSON.stringify(variants))

        //=> Shipping
        formData.append('shipping[weight]', inputWeight.value)
        formData.append('shipping[dimensions][width]', inputWidth.value)
        formData.append('shipping[dimensions][height]', inputHeight.value)
        formData.append('shipping[dimensions][length]', inputLength.value)

        //=> Categories
        formData.append(
            `categories`,
            JSON.stringify(
                touched.current
                    ? categories
                          .filter((cat) => cat.isSelected)
                          .map((cat) => cat._id)
                    : (product?.categories.map((cat) => cat._id) as string[])
            )
        )

        //5) Dispatch action to create a product
        if (mode === 'ADD_NEW') {
            return dispatch(
                createProductAsync({
                    formData,
                    cb: (res) => {
                        res && clickResetHandler()
                        setShowAlert(true)
                    },
                })
            )
        }

        //6) Dispatch action to update a product
        if (!product) return
        dispatch(
            updateProductAsync({
                id: product._id,
                formData,
                cb: () => {
                    setShowAlert(true)
                },
            })
        )
    }

    return (
        <>
            <AddNewProductStyled>
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
                    {showAlert && (
                        <Alert
                            sx={{ textAlign: 'left', margin: '16px' }}
                            severity={
                                errors.create || errors.update
                                    ? 'error'
                                    : 'success'
                            }
                            variant="outlined"
                            onClose={() => setShowAlert(false)}
                        >
                            <AlertTitle>
                                {errors.create || errors.update
                                    ? 'Error Occured!'
                                    : 'Success!'}
                            </AlertTitle>
                            {errors.create ||
                                errors.update ||
                                'Product has been created successfully.'}
                        </Alert>
                    )}
                    <TabPanel value={activeTab} index={0}>
                        <Stack gap="16px">
                            <Stack>
                                <Stack flex={1}>
                                    <TextField
                                        label="Title"
                                        value={inputTitle.value}
                                        onChange={inputTitle.onChangeHandler}
                                        onBlur={inputTitle.onBlurHandler}
                                        error={inputTitle.validation.error}
                                        helperText={
                                            inputTitle.validation.message
                                        }
                                        inputRef={refInputTitle}
                                    />
                                </Stack>
                            </Stack>
                            <Stack>
                                <Stack flex={1}>
                                    <TextField
                                        label="Description"
                                        value={inputDescription.value}
                                        onChange={
                                            inputDescription.onChangeHandler
                                        }
                                        onBlur={inputDescription.onBlurHandler}
                                        error={
                                            inputDescription.validation.error
                                        }
                                        helperText={
                                            inputDescription.validation.message
                                        }
                                        inputRef={refInputDescription}
                                        multiline
                                        rows={8}
                                    />
                                </Stack>
                            </Stack>
                            <Stack flexDirection="row" gap="16px">
                                <Stack flex={1}>
                                    <TextField
                                        label="Regular Price"
                                        value={inputRegularPrice.value}
                                        onChange={
                                            inputRegularPrice.onChangeHandler
                                        }
                                        onBlur={inputRegularPrice.onBlurHandler}
                                        error={
                                            inputRegularPrice.validation.error
                                        }
                                        helperText={
                                            inputRegularPrice.validation.message
                                        }
                                        inputRef={refInputRegularPrice}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EuroOutlined fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>
                                <Stack flex={1}>
                                    <TextField
                                        label="Selling Price"
                                        value={inputSellingPrice.value}
                                        onChange={
                                            inputSellingPrice.onChangeHandler
                                        }
                                        onBlur={inputSellingPrice.onBlurHandler}
                                        error={
                                            inputSellingPrice.validation.error
                                        }
                                        helperText={
                                            inputSellingPrice.validation.message
                                        }
                                        inputRef={refInputSellingPrice}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EuroOutlined fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>
                            </Stack>
                            <Stack flexDirection="row" gap="16px">
                                <Stack flex={1}>
                                    <TextField
                                        label="Brand"
                                        value={inputBrand.value}
                                        onChange={inputBrand.onChangeHandler}
                                        onBlur={inputBrand.onBlurHandler}
                                        error={inputBrand.validation.error}
                                        helperText={
                                            inputBrand.validation.message
                                        }
                                        inputRef={refInputBrand}
                                    />
                                </Stack>
                                <Stack flex={1}>
                                    <TextField
                                        label="Model Number"
                                        value={inputModelNo.value}
                                        onChange={inputModelNo.onChangeHandler}
                                        onBlur={inputModelNo.onBlurHandler}
                                        error={inputModelNo.validation.error}
                                        helperText={
                                            inputModelNo.validation.message
                                        }
                                        inputRef={refInputModelNo}
                                    />
                                </Stack>
                                <Stack flex={1}>
                                    <TextField
                                        label="Release Date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) =>
                                            setSelectedDate(e.target.value)
                                        }
                                    />
                                </Stack>
                            </Stack>
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                gap="16px"
                            >
                                <Stack flex={1}>
                                    <MediaPicker
                                        onClearSelection={onClearSelection(
                                            'Image'
                                        )}
                                        default_selected={
                                            selectedProductImage
                                                ? [selectedProductImage]
                                                : []
                                        }
                                        buttonText="Pick Product Image"
                                        modalButtonText="Set Product Image"
                                        onSelect={(files) =>
                                            setSelectedProductImage(files[0])
                                        }
                                    />
                                </Stack>
                                <Stack flex={1}>
                                    <MediaPicker
                                        onClearSelection={onClearSelection(
                                            'Gallery'
                                        )}
                                        default_selected={
                                            selectedProductGallery
                                                ? selectedProductGallery
                                                : []
                                        }
                                        buttonText="Pick Product Gallery"
                                        modalButtonText="Add To Product Gallery"
                                        selectMultiple
                                        onSelect={(files) =>
                                            setSelectedProductGallery(files)
                                        }
                                    />
                                </Stack>
                                <Stack flex={1}>
                                    <FormControlLabel
                                        label="Is Staff Picked?"
                                        control={
                                            <Checkbox
                                                checked={isStaffPiced}
                                                onChange={() =>
                                                    setIsStaffPicked(
                                                        (state) => !state
                                                    )
                                                }
                                            />
                                        }
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <Stack gap="16px">
                            <Stack>
                                <Stack flex={1}>
                                    <TextField
                                        label="Sku"
                                        value={inputSku.value}
                                        onChange={inputSku.onChangeHandler}
                                        onBlur={inputSku.onBlurHandler}
                                        error={inputSku.validation.error}
                                        helperText={inputSku.validation.message}
                                        inputRef={refInputSku}
                                    />
                                </Stack>
                            </Stack>
                            <Stack flexDirection="row" gap="16px">
                                <Stack flex={1}>
                                    <TextField
                                        label="Stock"
                                        type="number"
                                        value={inputStock.value}
                                        onChange={inputStock.onChangeHandler}
                                        onBlur={inputStock.onBlurHandler}
                                        error={inputStock.validation.error}
                                        helperText={
                                            inputStock.validation.message
                                        }
                                        inputRef={refInputStock}
                                    />
                                </Stack>
                                <Stack flex={1}>
                                    <TextField
                                        label="Low Stock Threshold"
                                        type="number"
                                        value={inputLowStockThreshold.value}
                                        onChange={
                                            inputLowStockThreshold.onChangeHandler
                                        }
                                        onBlur={
                                            inputLowStockThreshold.onBlurHandler
                                        }
                                        error={
                                            inputLowStockThreshold.validation
                                                .error
                                        }
                                        helperText={
                                            inputLowStockThreshold.validation
                                                .message
                                        }
                                        inputRef={refInputLowStockThreshold}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={activeTab} index={2}>
                        <Stack
                            flexDirection="row"
                            justifyContent="flex-start"
                            gap="16px"
                        >
                            <Stack>
                                <TextField
                                    sx={{ width: '224px' }}
                                    label="Product Variant"
                                    select
                                    value={selectedOption}
                                    onChange={(e) =>
                                        setSelectedOption(e.target.value)
                                    }
                                >
                                    <MenuItem
                                        disabled={productVariations?.some(
                                            (prodVar) =>
                                                prodVar.name === 'Color'
                                        )}
                                        value="Color"
                                    >
                                        Color
                                    </MenuItem>
                                    <MenuItem
                                        disabled={productVariations?.some(
                                            (prodVar) => prodVar.name === 'Size'
                                        )}
                                        value="Size"
                                    >
                                        Size
                                    </MenuItem>
                                    <MenuItem value="Custom">Custom</MenuItem>
                                </TextField>
                            </Stack>
                            <Stack flexDirection="row" gap="16px">
                                <Button
                                    sx={{ width: '8rem' }}
                                    disableElevation
                                    size="large"
                                    variant="contained"
                                    onClick={clickAddVariationHandler}
                                >
                                    Add
                                </Button>
                                <Button
                                    sx={{ width: '8rem' }}
                                    disableElevation
                                    size="large"
                                    variant="outlined"
                                    onClick={() => setProductVariations([])}
                                >
                                    Clear
                                </Button>
                            </Stack>
                        </Stack>
                        <Stack>
                            {productVariations?.map((productVar, i) => {
                                return productVar.name === 'Color' ? (
                                    <Accordion key={i}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreOutlined />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Color</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack
                                                gap="80px"
                                                flexDirection="row"
                                            >
                                                <Stack>
                                                    <Typography
                                                        variant="caption"
                                                        fontWeight="bold"
                                                    >
                                                        Name:
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        Color
                                                    </Typography>
                                                </Stack>
                                                <Autocomplete
                                                    fullWidth={true}
                                                    multiple
                                                    id="tags-standard"
                                                    onChange={(e, v) =>
                                                        onChangeVariationSelectionHandler(
                                                            e,
                                                            v,
                                                            'Color'
                                                        )
                                                    }
                                                    value={productVar.terms
                                                        .filter(
                                                            (term) =>
                                                                term.isSelected
                                                        )
                                                        .map(
                                                            (term) => term.name
                                                        )}
                                                    options={productVar.terms.map(
                                                        (term) => term.name
                                                    )}
                                                    getOptionLabel={(option) =>
                                                        option
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            label="Color"
                                                            placeholder="Search terms"
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                ) : productVar.name === 'Size' ? (
                                    <Accordion key={i}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreOutlined />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>Size</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack
                                                gap="80px"
                                                flexDirection="row"
                                            >
                                                <Stack>
                                                    <Typography
                                                        variant="caption"
                                                        fontWeight="bold"
                                                    >
                                                        Name:
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        Size
                                                    </Typography>
                                                </Stack>
                                                <Autocomplete
                                                    fullWidth={true}
                                                    multiple
                                                    id="tags-standard"
                                                    onChange={(e, v) =>
                                                        onChangeVariationSelectionHandler(
                                                            e,
                                                            v,
                                                            'Size'
                                                        )
                                                    }
                                                    value={productVar.terms
                                                        .filter(
                                                            (term) =>
                                                                term.isSelected
                                                        )
                                                        .map(
                                                            (term) => term.name
                                                        )}
                                                    options={productVar.terms.map(
                                                        (p) => p.name
                                                    )}
                                                    getOptionLabel={(option) =>
                                                        option
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            label="Size"
                                                            placeholder="Search terms"
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                ) : (
                                    <Accordion key={i}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreOutlined />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>
                                                {productVar.name}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack
                                                flexDirection="row"
                                                gap="16px"
                                            >
                                                <Stack flex={1}>
                                                    <TextField
                                                        label="Name"
                                                        value={productVar.name}
                                                        onChange={(e) =>
                                                            onChangeInputVariationHandler(
                                                                e,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </Stack>
                                                <Stack flex={3}>
                                                    <TextField
                                                        label="Terms"
                                                        defaultValue={productVariations
                                                            .find(
                                                                (variant) =>
                                                                    variant.name ===
                                                                    productVar.name
                                                            )
                                                            ?.terms.map(
                                                                (term) =>
                                                                    term.name
                                                            )
                                                            .join('|')}
                                                        onChange={(e) => {
                                                            const upd = [
                                                                ...productVariations,
                                                            ]
                                                            upd[i].terms =
                                                                e.target.value
                                                                    .trim()
                                                                    .split('|')
                                                                    .filter(
                                                                        (
                                                                            term
                                                                        ) =>
                                                                            term.trim() !==
                                                                            ''
                                                                    )
                                                                    .map(
                                                                        (
                                                                            val
                                                                        ) => ({
                                                                            name: val,
                                                                            isSelected:
                                                                                true,
                                                                        })
                                                                    )
                                                            setProductVariations(
                                                                upd
                                                            )
                                                        }}
                                                        helperText={
                                                            'Use "|" to sepearte terms values.'
                                                        }
                                                    />
                                                </Stack>
                                            </Stack>
                                            <Stack
                                                flexDirection="row"
                                                gap="16px"
                                                flexWrap="wrap"
                                            >
                                                {productVariations
                                                    .find(
                                                        (variant) =>
                                                            variant.name ===
                                                            productVar.name
                                                    )
                                                    ?.terms.map((term) => (
                                                        <Box>
                                                            <MediaPicker
                                                                default_selected={
                                                                    term.image
                                                                        ? [
                                                                              term.image,
                                                                          ]
                                                                        : []
                                                                }
                                                                onSelect={(
                                                                    files
                                                                ) =>
                                                                    setProductVariations(
                                                                        productVariations.map(
                                                                            (
                                                                                variant
                                                                            ) => {
                                                                                if (
                                                                                    variant.name ===
                                                                                    productVar.name
                                                                                ) {
                                                                                    return {
                                                                                        ...variant,
                                                                                        terms: variant.terms.map(
                                                                                            (
                                                                                                currterm
                                                                                            ) => {
                                                                                                if (
                                                                                                    currterm.name ===
                                                                                                    term.name
                                                                                                )
                                                                                                    return {
                                                                                                        ...currterm,
                                                                                                        image:
                                                                                                            files.length >
                                                                                                            0
                                                                                                                ? files[0]
                                                                                                                : undefined,
                                                                                                    }
                                                                                                return currterm
                                                                                            }
                                                                                        ),
                                                                                    }
                                                                                }
                                                                                return variant
                                                                            }
                                                                        )
                                                                    )
                                                                }
                                                                buttonText={`${term.name} Image`}
                                                                modalButtonText="Set custom variant image"
                                                            />
                                                        </Box>
                                                    ))}
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            })}
                        </Stack>
                    </TabPanel>
                    <TabPanel value={activeTab} index={3}>
                        <Stack gap="16px">
                            <Stack flexDirection="row" gap="16px">
                                <Stack flex="1">
                                    <TextField
                                        label="Weight"
                                        value={inputWeight.value}
                                        onChange={inputWeight.onChangeHandler}
                                        onBlur={inputWeight.onBlurHandler}
                                        error={inputWeight.validation.error}
                                        helperText={
                                            inputWeight.validation.message
                                        }
                                        inputRef={refInputWeight}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    kg
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>
                            </Stack>
                            <Stack>
                                <Stack flexDirection="row" gap="16px">
                                    <Stack flex="1">
                                        <TextField
                                            label="Width"
                                            value={inputWidth.value}
                                            onChange={
                                                inputWidth.onChangeHandler
                                            }
                                            onBlur={inputWidth.onBlurHandler}
                                            error={inputWidth.validation.error}
                                            helperText={
                                                inputWidth.validation.message
                                            }
                                            inputRef={refInputWidth}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        cm
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                    <Stack flex="1">
                                        <TextField
                                            label="Height"
                                            value={inputHeight.value}
                                            onChange={
                                                inputHeight.onChangeHandler
                                            }
                                            onBlur={inputHeight.onBlurHandler}
                                            error={inputHeight.validation.error}
                                            helperText={
                                                inputHeight.validation.message
                                            }
                                            inputRef={refInputHeight}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        cm
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                    <Stack flex="1">
                                        <TextField
                                            label="Length"
                                            value={inputLength.value}
                                            onChange={
                                                inputLength.onChangeHandler
                                            }
                                            onBlur={inputLength.onBlurHandler}
                                            error={inputLength.validation.error}
                                            helperText={
                                                inputLength.validation.message
                                            }
                                            inputRef={refInputLength}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        cm
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={activeTab} index={4}>
                        <Stack
                            flexDirection="row"
                            justifyContent="space-between"
                            gap="16px"
                        >
                            <Stack gap="4px" height="100%" textAlign="left">
                                {categories.length <= 0 && (
                                    <>
                                        <Typography variant="h6">
                                            Uh oh! No categories found.
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Visit{' '}
                                            <Link
                                                style={{
                                                    color: 'inherit',
                                                    fontWeight: 'bold',
                                                }}
                                                to="/dashboard/categories"
                                            >
                                                {' '}
                                                categories{' '}
                                            </Link>
                                            to create some new categories.
                                        </Typography>
                                    </>
                                )}
                                {categories.map((cat) => (
                                    <FormControlLabel
                                        key={cat.name}
                                        label={cat.name}
                                        control={
                                            <Checkbox
                                                checked={cat.isSelected}
                                                onChange={() =>
                                                    dispatch(
                                                        editSelectedStatus({
                                                            ids: [cat._id],
                                                        })
                                                    )
                                                }
                                            />
                                        }
                                    />
                                ))}
                            </Stack>
                            <Stack gap="16px">
                                <Button
                                    startIcon={<CheckOutlined />}
                                    disableElevation
                                    variant="contained"
                                    size="small"
                                    disabled={categories.length <= 0}
                                    onClick={() =>
                                        dispatch(
                                            editSelectedStatus({
                                                ids: categories.map(
                                                    (cat) => cat._id
                                                ),
                                                edit: true,
                                            })
                                        )
                                    }
                                >
                                    Select All
                                </Button>
                                <Button
                                    startIcon={<ClearOutlined />}
                                    disableElevation
                                    variant="contained"
                                    size="small"
                                    disabled={categories.length <= 0}
                                    onClick={() =>
                                        dispatch(
                                            editSelectedStatus({
                                                ids: categories.map(
                                                    (cat) => cat._id
                                                ),
                                                edit: false,
                                            })
                                        )
                                    }
                                >
                                    Select None
                                </Button>
                            </Stack>
                        </Stack>
                    </TabPanel>
                </Stack>
            </AddNewProductStyled>
            <Stack
                flexDirection="row"
                gap="16px"
                sx={{ paddingBottom: '32px' }}
            >
                <Button
                    size="large"
                    variant="contained"
                    onClick={clickActionHandler}
                    disableElevation
                    disabled={isLoading.create || isLoading.update}
                    sx={{ padding: '16px 48px' }}
                >
                    {isLoading.create || isLoading.update ? (
                        <CircularProgress size={16} />
                    ) : mode === 'EDIT' ? (
                        'Update Product'
                    ) : (
                        'Create New Product'
                    )}
                </Button>
                <Button
                    size="large"
                    variant="outlined"
                    onClick={clickResetHandler}
                    sx={{ padding: '16px 48px' }}
                >
                    Clear Fields
                </Button>
            </Stack>
        </>
    )
}

export default ProductView
