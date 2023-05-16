import {
    DeleteOutline,
    PhotoAlbumOutlined,
    SearchOutlined,
} from '@mui/icons-material'
import {
    Alert,
    AlertTitle,
    Button,
    ButtonGroup,
    Checkbox,
    CircularProgress,
    Divider,
    InputAdornment,
    Modal,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

import styled from 'styled-components'
import {
    deleteReviewAsync,
    editSelectedStatus,
    getManyReviewAsync,
    IReview,
    searchReviewAsync,
} from '../../../../store/reviewReducer'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import ReviewView from './ReviewView'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Reviews
const ReviewsStyled = styled.div`
    padding: 32px 0;
`

//Control Bar
const ControlBar = styled.div`
    width: 100%;
    height: 80px;
    background: ${(props) => props.theme.palette.grey['300']};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    padding: 0 16px;
`

//Widget
const Widget = styled.div`
    border: 1px solid ${(props) => props.theme.palette.grey['400']};
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 40px;
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 48px;
    height: 48px;
    background: #a7a7a7;
    display: flex;
    justify-content: center;
    align-items: center;

    & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

//Modal Inner Container
const ModalInnerContainer = styled.div`
    width: 800px;
    background: ${(props) => props.theme.palette.secondary.main};
    border-radius: 16px;
    padding: 48px 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
`

/**
 ** ======================================================
 ** Component [Reviews]
 ** ======================================================
 */
const Reviews = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const {
        data: reviews,
        isLoading,
        errors,
    } = useAppSelector((state) => state.review)
    const dispatch = useAppDispatch()

    //State
    const [showAlert, setShowAlert] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedReview, setSelectedReview] = useState<IReview>()

    //Refs
    const timeOutID = useRef<{ id: ReturnType<typeof setTimeout> | null }>({
        id: null,
    })

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    useEffect(() => {
        dispatch(getManyReviewAsync())
    }, [])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click selete all handler
    const clickSelectAllHandler = () => {
        //1) Determine state
        const state = reviews.every((review) => !review.isSelected)

        //2) Dispatch action
        dispatch(
            editSelectedStatus({
                ids: reviews.map((review) => review._id),
                edit: state,
            })
        )
    }

    //Click select  handler
    const clickSelectHandler = (id: string) => {
        dispatch(
            editSelectedStatus({
                ids: [id],
            })
        )
    }

    //Click delete handler
    const clickDeleteHandler = () => {
        //1) Get ids of selected categories
        const ids = reviews
            .filter((review) => review.isSelected)
            .map((review) => review._id)

        //2) Dispatch action to delete reviews
        dispatch(deleteReviewAsync({ ids, cb: () => '' }))
    }

    //On search input change handler
    const onSearchInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        //1) Get query
        const query = e.currentTarget.value

        //2) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //3) Refetch reviews when query empty again
        if (!query || query.length <= 0) {
            return dispatch(getManyReviewAsync())
        }

        //4) Set timeout to fetch reviews via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchReviewAsync(query))
        }, 300)
    }

    return (
        <ReviewsStyled>
            <Stack gap="80px">
                <ControlBar>
                    <Stack
                        width="100%"
                        flexDirection="row"
                        justifyContent="space-between"
                    >
                        <TextField
                            type="search"
                            placeholder="Search here"
                            color="primary"
                            variant="standard"
                            onChange={onSearchInputChangeHandler}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={!isLoading.delete && <DeleteOutline />}
                            onClick={clickDeleteHandler}
                            disabled={
                                reviews.every((review) => !review.isSelected) ||
                                isLoading.delete
                            }
                            disableElevation
                        >
                            {isLoading.delete ? (
                                <CircularProgress size={16} />
                            ) : (
                                'Delete Selected'
                            )}
                        </Button>
                    </Stack>
                </ControlBar>
                <Widget>
                    {showAlert && errors.fetch ? (
                        <Alert
                            sx={{ textAlign: 'left' }}
                            severity="error"
                            variant="outlined"
                            onClose={() => setShowAlert(false)}
                        >
                            <AlertTitle>Error Occured!</AlertTitle>
                            {errors.fetch}
                        </Alert>
                    ) : (
                        ''
                    )}
                    <Stack textAlign="left">
                        <Typography variant="h5">Reviews</Typography>
                    </Stack>
                    <Table
                        sx={{ minWidth: 650, overflowY: 'scroll' }}
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        onChange={clickSelectAllHandler}
                                        color="primary"
                                        indeterminate={
                                            reviews.filter(
                                                (reviews) => reviews.isSelected
                                            ).length > 0 &&
                                            reviews.filter(
                                                (reviews) => reviews.isSelected
                                            ).length < reviews.length
                                        }
                                        checked={
                                            reviews.filter(
                                                (review) => review.isSelected
                                            ).length > 0 &&
                                            reviews.filter(
                                                (review) => review.isSelected
                                            ).length === reviews.length
                                        }
                                        inputProps={{
                                            'aria-label':
                                                'select all media files',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>Images</TableCell>
                                <TableCell align="left">Title</TableCell>
                                <TableCell align="center">Review</TableCell>
                                <TableCell align="center">Rating</TableCell>
                                <TableCell align="right">Author</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading.fetch ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress size={48} />
                                    </TableCell>
                                </TableRow>
                            ) : reviews.length <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Typography variant="h6">
                                            Uh oh! No reviews found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reviews.map((review) => (
                                    <TableRow key={review._id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={review.isSelected}
                                                onChange={() =>
                                                    clickSelectHandler(
                                                        review._id
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack
                                                flexDirection="row"
                                                justifyContent="flex-start"
                                                gap="16px"
                                            >
                                                {review?.images?.length > 0 ? (
                                                    <Stack
                                                        flexDirection="row"
                                                        sx={{ width: '104px' }}
                                                        flexWrap="wrap"
                                                        gap="4px"
                                                    >
                                                        {review.images.map(
                                                            (img) => (
                                                                <ImageWrapper
                                                                    key={
                                                                        img.url
                                                                    }
                                                                >
                                                                    <img
                                                                        crossOrigin="anonymous"
                                                                        src={
                                                                            img.url
                                                                        }
                                                                        alt={
                                                                            img.title
                                                                        }
                                                                    />
                                                                </ImageWrapper>
                                                            )
                                                        )}
                                                    </Stack>
                                                ) : (
                                                    <ImageWrapper>
                                                        <PhotoAlbumOutlined
                                                            fontSize="large"
                                                            color="secondary"
                                                        />
                                                    </ImageWrapper>
                                                )}

                                                <Stack
                                                    alignItems="flex-start"
                                                    gap="8px"
                                                >
                                                    {review.title}
                                                    <ButtonGroup
                                                        size="small"
                                                        variant="text"
                                                    >
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedReview(
                                                                    review
                                                                )
                                                                setShowModal(
                                                                    true
                                                                )
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Divider />
                                                        <Button
                                                            disabled={
                                                                isLoading.delete &&
                                                                selectedReview?._id ===
                                                                    review._id
                                                            }
                                                            onClick={() => {
                                                                setSelectedReview(
                                                                    review
                                                                )
                                                                dispatch(
                                                                    deleteReviewAsync(
                                                                        {
                                                                            ids: [
                                                                                review._id,
                                                                            ],
                                                                        }
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            {isLoading.delete &&
                                                            selectedReview?._id ===
                                                                review._id ? (
                                                                <CircularProgress
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                'Delete'
                                                            )}
                                                        </Button>
                                                    </ButtonGroup>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="left">
                                            {review.title}
                                        </TableCell>
                                        <TableCell align="center">
                                            {review.review}
                                        </TableCell>
                                        <TableCell align="center">
                                            {review.rating}
                                        </TableCell>
                                        <TableCell align="right">
                                            {review.author?.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Date(
                                                review.created_at
                                            ).toDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Widget>
                <Widget>
                    <Stack textAlign="left">
                        <Typography variant="h5">Add New Review</Typography>
                    </Stack>
                    <ReviewView />
                </Widget>
            </Stack>
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ModalInnerContainer>
                    <Typography variant="h5">Edit Review</Typography>
                    <ReviewView mode="EDIT" review={selectedReview} />
                </ModalInnerContainer>
            </Modal>
        </ReviewsStyled>
    )
}

export default Reviews
