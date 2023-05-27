import { useState } from 'react'

import {
    Star,
    StarOutline,
    ExpandLess,
    ExpandMore,
    EditOutlined,
    DeleteOutline,
    PhotoCamera,
} from '@mui/icons-material'
import {
    Stack,
    Avatar,
    Typography,
    Rating,
    Button,
    Divider,
    Box,
    IconButton,
    Tooltip,
    ButtonGroup,
    TextField,
    CircularProgress,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { IReview } from '../../store/reviewReducer'
import useInput from '../../hooks/useInput'
import {
    combineValidators,
    isAlpha,
    isAlphaNumeric,
    isEmpty,
} from '../../utils/validators'
import useUpload from '../../hooks/useUpload'
import { GenericFormData } from 'axios'

/*
 ** **
 ** ** ** State & Hooks
 ** **
 */
//Review
const ReviewStyled = styled.div``

//Image Wrapper
const ImageWrapper = styled.div`
    width: 3rem;
    height: 3rem;

    & img {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
`

/**
 ** ======================================================
 ** Interface [ReviewPropss]
 ** ======================================================
 */
interface ReviewProps {
    review: IReview
    readonly?: boolean
    isLoading?: boolean
    onSave?: (formData: GenericFormData, disableEditMode: () => void) => void
    onDelete?: () => void
}

/**
 ** ======================================================
 ** Component [Review]
 ** ======================================================
 */
const Review = ({
    review,
    readonly = false,
    isLoading = false,
    onSave = () => undefined,
    onDelete = () => undefined,
}: ReviewProps) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedRatings, setSelectedRatings] = useState(review.rating)

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
    const inputImages = useUpload({
        default_value: review?.images?.map((img) => ({
            name: img.title,
            url: img.url,
        })),
    })

    /**
     ** **
     ** ** ** Form Fields
     ** **
     */
    const clickSaveHandler = () => {
        //1) Trigger validation
        inputTitle.validation.validate()
        inputReview.validation.validate()

        //2) Return if error
        if (inputTitle.validation.error || !inputTitle.validation.touched)
            return
        else if (
            inputReview.validation.error ||
            !inputReview.validation.touched
        )
            return

        //3) No error, proceed with creating formData
        const formData = new FormData()
        formData.append('title', inputTitle.value)
        formData.append('review', inputReview.value)
        formData.append('rating', selectedRatings.toString())

        const imgFiles = inputImages.value.flatMap((img) =>
            img.file ? [img.file] : []
        )
        imgFiles.map((img) => formData.append('images', img))

        //4) Call onSave with updated data
        onSave(formData, () => setIsEditMode(false))
    }

    return (
        <ReviewStyled>
            <Stack gap="32px">
                <Stack key={review._id} gap="8px">
                    <Stack
                        sx={{ textAlign: 'left' }}
                        flexDirection="row"
                        gap="16px"
                    >
                        <Stack flex="0 0 15%" gap="16px">
                            <Stack alignItems="center">
                                <Avatar
                                    sx={{
                                        width: '4.4rem',
                                        height: '4.4rem',
                                        '& img': {
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        },
                                    }}
                                >
                                    <img
                                        src={review?.author?.photo?.url}
                                        crossOrigin="anonymous"
                                    />
                                </Avatar>
                                <Typography variant="caption">
                                    {review.author?.name}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack flex={1} gap="32px">
                            <Stack
                                flexDirection="row"
                                justifyContent="space-between"
                            >
                                <Stack flex="1" gap="8px">
                                    <Rating
                                        icon={<Star color="primary" />}
                                        emptyIcon={
                                            <StarOutline color="primary" />
                                        }
                                        onChange={(e, val) =>
                                            val && setSelectedRatings(val)
                                        }
                                        value={selectedRatings}
                                        readOnly={!isEditMode}
                                    />
                                    {isEditMode ? (
                                        <TextField
                                            label="Title"
                                            value={inputTitle.value}
                                            onChange={
                                                inputTitle.onChangeHandler
                                            }
                                            onBlur={inputTitle.onBlurHandler}
                                            error={inputTitle.validation.error}
                                            helperText={
                                                inputTitle.validation.message
                                            }
                                            fullWidth={true}
                                        />
                                    ) : (
                                        <Typography variant="h6">
                                            {review.title}
                                        </Typography>
                                    )}
                                </Stack>
                                <Stack>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {new Date(
                                            review.created_at
                                        ).toDateString()}
                                    </Typography>

                                    {!isEditMode && !readonly ? (
                                        <ButtonGroup
                                            sx={{
                                                justifyContent: 'flex-end',
                                                gap: '8px',
                                            }}
                                        >
                                            <Box>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        onClick={() =>
                                                            setIsEditMode(true)
                                                        }
                                                    >
                                                        <EditOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <Box>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={onDelete}
                                                    >
                                                        <DeleteOutline />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ButtonGroup>
                                    ) : (
                                        ''
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack
                        sx={{ textAlign: 'left' }}
                        flexDirection="row"
                        gap="16px"
                    >
                        <Stack
                            flex="0 0 15%"
                            gap="8px"
                            flexDirection="row"
                            flexWrap="wrap"
                            height="max-content"
                            padding="8px 0"
                        >
                            {inputImages.value.map((image) => (
                                <ImageWrapper>
                                    <img
                                        src={image?.url}
                                        alt={image?.name}
                                        crossOrigin="anonymous"
                                    />
                                </ImageWrapper>
                            ))}
                            <Box
                                width="3rem"
                                height="3rem"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {isEditMode && (
                                    <IconButton component="label">
                                        <PhotoCamera />
                                        <input
                                            type="file"
                                            onChange={inputImages.onChange}
                                            multiple
                                            hidden
                                        />
                                    </IconButton>
                                )}
                            </Box>
                        </Stack>
                        <Stack flex={1} gap="32px">
                            <Stack gap="8px">
                                {isEditMode ? (
                                    <TextField
                                        label="Write a review..."
                                        value={inputReview.value}
                                        onChange={inputReview.onChangeHandler}
                                        onBlur={inputReview.onBlurHandler}
                                        error={inputReview.validation.error}
                                        helperText={
                                            inputReview.validation.message
                                        }
                                        fullWidth={true}
                                        multiline
                                        rows={6}
                                    />
                                ) : review.review.length > 300 &&
                                  !isExpanded ? (
                                    review.review.slice(0, 460) + '...'
                                ) : (
                                    review.review
                                        .split('\n')
                                        .map((para) => (
                                            <Typography color="GrayText">
                                                {para}
                                            </Typography>
                                        ))
                                )}
                                {review.review.length > 460 && !isEditMode ? (
                                    <Box>
                                        <Button
                                            onClick={() => {
                                                setIsExpanded((state) => !state)
                                            }}
                                            endIcon={
                                                isExpanded ? (
                                                    <ExpandLess />
                                                ) : (
                                                    <ExpandMore />
                                                )
                                            }
                                        >
                                            {isExpanded
                                                ? 'Show Less'
                                                : 'Read More'}
                                        </Button>
                                    </Box>
                                ) : (
                                    isEditMode && (
                                        <ButtonGroup>
                                            <Button
                                                disabled={
                                                    inputTitle.validation
                                                        .error ||
                                                    inputReview.validation.error
                                                }
                                                onClick={clickSaveHandler}
                                            >
                                                {isLoading ? (
                                                    <CircularProgress
                                                        size={16}
                                                    />
                                                ) : (
                                                    'Save'
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    //=> Reset input fields
                                                    inputTitle.reset(true),
                                                        inputImages.reset(true)
                                                    inputReview.reset(true)
                                                    setSelectedRatings(
                                                        review.rating
                                                    )

                                                    //=> Disable edit mode
                                                    setIsEditMode(false)
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </ButtonGroup>
                                    )
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
                <Divider />
            </Stack>
        </ReviewStyled>
    )
}

export default Review
