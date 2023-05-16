import { SyntheticEvent, useRef, useState } from 'react'

import { PhotoCamera } from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Button,
    ButtonGroup,
    CircularProgress,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    TextFieldProps,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { searchUserAsync } from '../../../../store/userReducer'
import {
    createReviewAsync,
    IReview,
    updateReviewAsync,
} from '../../../../store/reviewReducer'

//Hooks & Func
import useInput from '../../../../hooks/useInput'
import {
    combineValidators,
    isAlpha,
    isEmpty,
} from '../../../../utils/validators'
import useUpload from '../../../../hooks/useUpload'
import { searchProductAsync } from '../../../../store/productReducer'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Review
const ReviewStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 48px;
    height: 48px;

    & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

/**
 ** ======================================================
 ** Interface [ReviewViewProps]
 ** ======================================================
 */
interface ReviewViewProps {
    mode?: 'EDIT' | 'ADD_NEW'
    review?: IReview
}

/**
 ** ======================================================
 ** Component [ReviewView]
 ** ======================================================
 */
const ReviewView = ({ mode = 'ADD_NEW', review }: ReviewViewProps) => {
    /**
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const { isLoading, errors } = useAppSelector((state) => state.review)
    const dispatch = useAppDispatch()
    const users = useAppSelector((state) => state.user.data)
    const products = useAppSelector((state) => state.product.data)

    //State
    const [showAlert, setShowAlert] = useState(false)
    const [selectedRatings, setSelectedRatings] = useState(
        review?.rating.toString() || '5'
    )
    const [selectedDate, setSelectedDate] = useState(
        new Date(review?.created_at || Date.now()).toISOString().slice(0, 10)
    )
    const [selectedProduct, setSelectedProduct] = useState<{
        label: string
        _id: string
    } | null>(
        review?.product
            ? { label: review.product.title, _id: review.product._id }
            : null
    )
    const [selectedAuthor, setSelectedAuthor] = useState<{
        label: string
        _id: string
    } | null>(
        review?.author
            ? { label: review.author.username, _id: review.author._id }
            : null
    )

    //Refs
    const refInputTitle = useRef<HTMLInputElement>(null)
    const refInputReview = useRef<HTMLInputElement>(null)
    const refInputProduct = useRef<HTMLInputElement>(null)
    const refInputAuthor = useRef<HTMLInputElement>(null)

    const timeOutID = useRef<{ id: ReturnType<typeof setTimeout> | null }>({
        id: null,
    })

    /**
     ** **
     ** ** ** Form Fields
     ** **
     */
    //Title
    const inputTitle = useInput({
        default_value: review?.title || '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Give a nice title to the review.',
            },
            {
                validator: isAlpha,
                message:
                    'Title must only have letters or space. No special characters are allowed.',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                },
            },
        ]),
    })

    //Review
    const inputReview = useInput({
        default_value: review?.review || '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Write a short and descriptive review of a product.',
            },
            {
                validator: isAlpha,
                message:
                    'Review details must only have letters, spaces or puntuation marks. No other special character are allowed.',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                    ignorePunctuations: true,
                },
            },
        ]),
    })

    //Images
    const inputImages = useUpload({
        default_value:
            mode === 'EDIT'
                ? review?.images?.map((img) => ({
                      name: img.title,
                      url: img.url,
                  }))
                : undefined,
    })

    /**
     ** **
     ** ** ** Methods
     ** **
     */
    //Reset input handler
    const clickResetHandler = () => {
        //1) Reset inputs
        inputTitle.reset(false)
        inputReview.reset(false)
        inputImages.reset(false)

        //2) Reset selects
        setSelectedAuthor(null)
        setSelectedProduct(null)
        setSelectedRatings('5')
        setSelectedDate(new Date().toISOString().slice(0, 10))
    }

    //Add or update review handler
    const clickButtonHandler = () => {
        setShowAlert(false)

        //1) Trigger validation
        inputTitle.validation.validate()
        inputReview.validation.validate()

        //2) Focus on invalid fields
        if (inputTitle.validation.error || !inputTitle.validation.touched) {
            return refInputTitle.current?.focus()
        } else if (
            inputReview.validation.error ||
            !inputReview.validation.touched
        ) {
            return refInputReview.current?.focus()
        } else if (!selectedProduct) {
            return refInputProduct.current?.focus()
        } else if (!selectedAuthor) {
            return refInputAuthor.current?.focus()
        }

        //3) No errors, proceed with creating form data
        const formData = new FormData()

        formData.append('title', inputTitle.value)
        formData.append('review', inputReview.value)
        formData.append('rating', selectedRatings)
        formData.append('product', selectedProduct._id)
        formData.append('author', selectedAuthor._id)
        formData.append('date', selectedDate)
        inputImages.value.map((file) => {
            file.file && formData.append(`images`, file.file)
        })

        //4) Dispatch action to add new review
        if (mode === 'ADD_NEW') {
            return dispatch(
                createReviewAsync({
                    formData,
                    cb: () => {
                        setShowAlert(true)
                        clickResetHandler()
                    },
                })
            )
        }

        //5) Dispatch action to update review
        dispatch(
            updateReviewAsync({
                id: review?._id as string,
                formData,
                cb: () => {
                    setShowAlert(true)
                    clickResetHandler()
                },
            })
        )
    }

    //On change select prodcut handler
    const onChangeSelectProductHandler = (
        e: SyntheticEvent<Element, Event>,
        query: string
    ) => {
        //1) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //2) Refetch users when query empty again
        if (!query || query.length <= 0) {
            return
        }

        //3) Set timeout to fetch user via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchProductAsync(query))
        }, 300)
    }

    //On change input handler
    const onChangeHandler = (
        e: SyntheticEvent<Element, Event>,
        query: string
    ) => {
        //1) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //2) Refetch users when query empty again
        if (!query || query.length <= 0) {
            return
        }

        //3) Set timeout to fetch user via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchUserAsync(query))
        }, 300)
    }

    return (
        <ReviewStyled>
            {showAlert ? (
                <Alert
                    sx={{ textAlign: 'left' }}
                    variant="outlined"
                    severity={
                        errors.create || errors.update ? 'error' : 'success'
                    }
                    onClose={() => setShowAlert(false)}
                >
                    <AlertTitle>
                        {errors.create || errors.update
                            ? 'Error Occured!'
                            : 'Success'}
                    </AlertTitle>
                    {errors.create
                        ? errors.create
                        : errors.update
                        ? errors.update
                        : `Review has been ${
                              mode === 'EDIT' ? 'updated' : 'created'
                          } successfully.`}
                </Alert>
            ) : (
                ''
            )}
            <Stack gap="16px">
                <Stack flexDirection="row" gap="16px">
                    <Stack flex={1}>
                        <TextField
                            label="Title"
                            value={inputTitle.value}
                            onChange={inputTitle.onChangeHandler}
                            onBlur={inputTitle.onBlurHandler}
                            error={inputTitle.validation.error}
                            helperText={inputTitle.validation.message}
                            inputRef={refInputTitle}
                            fullWidth
                        />
                    </Stack>
                </Stack>
                <Stack flexDirection="row" gap="16px">
                    <Stack flex={1}>
                        <TextField
                            label="Review"
                            value={inputReview.value}
                            onChange={inputReview.onChangeHandler}
                            onBlur={inputReview.onBlurHandler}
                            error={inputReview.validation.error}
                            helperText={inputReview.validation.message}
                            inputRef={refInputReview}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Stack>
                </Stack>
                <Stack flexDirection="row" gap="16px">
                    <Stack flex={1}>
                        <TextField
                            onChange={(e) => setSelectedRatings(e.target.value)}
                            value={selectedRatings}
                            label="Rating"
                            fullWidth
                            select
                        >
                            <MenuItem value="5">5 star</MenuItem>
                            <MenuItem value="4">4 star</MenuItem>
                            <MenuItem value="3">3 star</MenuItem>
                            <MenuItem value="2">2 star</MenuItem>
                            <MenuItem value="1">1 star</MenuItem>
                        </TextField>
                    </Stack>
                    <Stack flex={1}>
                        <TextField
                            value={selectedDate}
                            label=""
                            onChange={(e) =>
                                setSelectedDate(
                                    new Date(e.target.value)
                                        .toISOString()
                                        .slice(0, 10)
                                )
                            }
                            fullWidth
                            type="date"
                        />
                    </Stack>
                </Stack>
                <Stack flexDirection="row" gap="16px">
                    <Stack flex={1}>
                        <Autocomplete
                            disablePortal
                            onInputChange={onChangeSelectProductHandler}
                            onChange={(_, val) => setSelectedProduct(val)}
                            value={selectedProduct}
                            options={products.map((prod) => ({
                                label: prod.title,
                                _id: prod._id,
                            }))}
                            renderInput={(params: TextFieldProps) => (
                                <TextField
                                    inputRef={refInputProduct}
                                    {...params}
                                    label="Product"
                                />
                            )}
                        />
                    </Stack>
                    <Stack flex={1}>
                        <Autocomplete
                            onInputChange={onChangeHandler}
                            onChange={(_, val) => val && setSelectedAuthor(val)}
                            value={selectedAuthor}
                            disablePortal
                            options={users.map((user) => ({
                                label: user.username,
                                _id: user._id,
                            }))}
                            noOptionsText={`Type few characters to get suggestions`}
                            renderInput={(params: TextFieldProps) => (
                                <TextField
                                    {...params}
                                    inputRef={refInputAuthor}
                                    label="Author"
                                />
                            )}
                        />
                    </Stack>
                </Stack>
                <Stack flexDirection="row" gap="16px">
                    <Stack>
                        <IconButton component="label">
                            <input
                                onChange={inputImages.onChange}
                                onBlur={inputImages.onBlur}
                                type="file"
                                accept="image/*"
                                hidden
                                multiple
                            />
                            <PhotoCamera />
                        </IconButton>
                        {inputImages.value.length <= 0 ? (
                            'Pick Images'
                        ) : (
                            <ButtonGroup
                                size="small"
                                variant="text"
                                disableRipple
                            >
                                <Button onClick={() => inputImages.reset()}>
                                    Remove Images
                                </Button>
                            </ButtonGroup>
                        )}
                    </Stack>
                    {inputImages.value.map((img) => (
                        <ImageWrapper key={img.url}>
                            <img
                                src={img.url}
                                alt={img.name}
                                crossOrigin="anonymous"
                            />
                        </ImageWrapper>
                    ))}
                </Stack>
            </Stack>
            <Stack flexDirection="row" gap="16px">
                <Button
                    size="large"
                    variant="contained"
                    disableElevation={true}
                    onClick={clickButtonHandler}
                    disabled={
                        mode === 'EDIT' ? isLoading.update : isLoading.create
                    }
                >
                    {isLoading.create || isLoading.update ? (
                        <CircularProgress size={16} />
                    ) : mode === 'EDIT' ? (
                        'Update category'
                    ) : (
                        'Add new category'
                    )}
                </Button>
                <Button
                    size="large"
                    variant="outlined"
                    onClick={clickResetHandler}
                >
                    Clear fields
                </Button>
            </Stack>
        </ReviewStyled>
    )
}

export default ReviewView
