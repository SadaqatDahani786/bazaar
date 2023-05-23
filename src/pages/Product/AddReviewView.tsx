import { useRef, useState } from 'react'

import { PhotoCamera, Star, StarOutline } from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Rating,
    Stack,
    TextField,
    Typography,
} from '@mui/material'

import { GenericFormData } from 'axios'
import styled from 'styled-components'

//Hooks & Func
import useInput from '../../hooks/useInput'
import useUpload from '../../hooks/useUpload'
import {
    combineValidators,
    isAlpha,
    isAlphaNumeric,
    isEmpty,
} from '../../utils/validators'

/*
 ** **
 ** ** ** Styled components
 ** **
 */
//Add Review View
const AddReviewViewStyled = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 3rem;
    height: 3rem;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

/**
 ** ======================================================
 ** Interface [AddReviewViewProps]
 ** ======================================================
 */
interface AddReviewViewProps {
    isLoading?: boolean
    onCancel?: () => void
    onSave?: (formData: GenericFormData) => void
}

/**
 ** ======================================================
 ** Component [AddReviewView]
 ** ======================================================
 */
const AddReviewView = ({
    isLoading = false,
    onCancel = () => undefined,
    onSave = () => undefined,
}: AddReviewViewProps) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const [selectedRating, setSelectedRating] = useState(5)

    const refInputTitle = useRef<HTMLInputElement>(null)
    const refInputReview = useRef<HTMLInputElement>(null)

    /*
     ** **
     ** ** ** Form fields
     ** **
     */
    //Title
    const inputTitle = useInput({
        default_value: '',
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
        default_value: '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Write a short and descriptive review of a product.',
            },
            {
                validator: isAlphaNumeric,
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
    const inputImages = useUpload({ default_value: [] })

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    const clickSaveHandler = () => {
        //1) Trigger Validate
        inputTitle.validation.validate()
        inputReview.validation.validate()

        //2) Focus on invalid input fields
        if (inputTitle.validation.error || !inputTitle.validation.touched)
            return refInputTitle.current?.focus()
        else if (
            inputReview.validation.error ||
            !inputReview.validation.touched
        )
            return refInputReview.current?.focus()

        //3) No errors, proceed with creating form data
        const formData = new FormData()

        formData.append('title', inputReview.value)
        formData.append('review', inputReview.value)
        formData.append('rating', selectedRating.toString())

        inputImages.value
            .flatMap((img) => (img.file ? [img.file] : []))
            .map((img) => formData.append('images', img))

        //4) Call on save and pass formdata
        onSave(formData)
    }

    return (
        <AddReviewViewStyled>
            <Stack
                flex={1}
                flexDirection="row"
                gap="8px"
                justifyContent="space-between"
                alignItems="center"
            >
                <Stack flex={1}>
                    <Rating
                        value={selectedRating}
                        onChange={(e, val) => val && setSelectedRating(val)}
                        icon={<Star color="primary" />}
                        emptyIcon={<StarOutline color="primary" />}
                    />
                </Stack>
                <Stack
                    flex={1}
                    gap="8px"
                    flexDirection="row"
                    flexWrap="wrap"
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: '3rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton component="label">
                            <PhotoCamera />
                            <input
                                onChange={inputImages.onChange}
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                            />
                        </IconButton>
                    </Box>
                    {inputImages.value.length <= 0 && (
                        <Typography>Add images for review</Typography>
                    )}
                    {inputImages.value.map((file) => (
                        <ImageWrapper>
                            <img src={file.url} crossOrigin="anonymous" />
                        </ImageWrapper>
                    ))}
                </Stack>
            </Stack>
            <TextField
                label="Title"
                value={inputTitle.value}
                onChange={inputTitle.onChangeHandler}
                onBlur={inputTitle.onBlurHandler}
                error={inputTitle.validation.error}
                helperText={inputTitle.validation.message}
                inputRef={refInputTitle}
                fullWidth={true}
            />
            <TextField
                label="Write a review"
                value={inputReview.value}
                onChange={inputReview.onChangeHandler}
                onBlur={inputReview.onBlurHandler}
                error={inputReview.validation.error}
                helperText={inputReview.validation.message}
                inputRef={refInputReview}
                fullWidth={true}
                multiline
                rows={4}
            />
            <Stack sx={{ marginTop: '16px' }} flexDirection="row" gap="16px">
                <Button
                    onClick={clickSaveHandler}
                    variant="contained"
                    disableElevation
                >
                    {isLoading ? (
                        <CircularProgress color="secondary" size={16} />
                    ) : (
                        'Save'
                    )}
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </Stack>
        </AddReviewViewStyled>
    )
}

export default AddReviewView
