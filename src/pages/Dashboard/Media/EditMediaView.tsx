import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'

import { DeleteOutline, EditOutlined } from '@mui/icons-material'
import { Box, Button, IconButton, TextField, Typography } from '@mui/material'

import styled from 'styled-components'

//Redux
import {
    deleteMediaAsync,
    editCaptionStatus,
    editDescriptionStatus,
    editTitleStatus,
    updateMediaAsync,
} from '../../../store/mediaReducer'
import { useAppDispatch, useAppSelector } from '../../../store/store'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Edit Media View
const EditMediaViewStyled = styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.palette.secondary.main};
    display: flex;
    flex-direction: column;
    gap: 16px;
`
//Row
const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;
    padding: 8px 0;
`

//Row Info
const RowInfo = styled(Row)`
    border-bottom: 1px solid ${(props) => props.theme.palette.grey['500']};
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 100%;
    height: 208px;

    & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

/**
 ** ======================================================
 ** Interface [IEditMediaViewProps]
 ** ======================================================
 */
interface IEditMediaViewProps {
    id: string | undefined
    mode: 'Edit' | 'View'
    onClose?: () => void
}

/**
 ** ======================================================
 ** Component [EditMediaView]
 ** ======================================================
 */
const EditMediaView = ({ id, mode, onClose }: IEditMediaViewProps) => {
    /**
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const mediaFiles = useAppSelector((state) => state.media)
    const dispatch = useAppDispatch()

    const selectedMedia = mediaFiles.find((media) => media._id === id)
    const [inputFields, setInputFields] = useState<{
        title: string
        description: string
        caption: string
    }>({ title: '', description: '', caption: '' })

    /**
     ** **
     ** ** ** Methods
     ** **
     */

    //Set input fiels default value from selected media
    useEffect(() => {
        if (!selectedMedia) return

        setInputFields({
            title: selectedMedia?.title.value,
            caption: selectedMedia?.caption.value,
            description: selectedMedia?.description.value,
        })
    }, [selectedMedia])

    //On change handler
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        //1) Get id and field from payload
        const field = e.currentTarget.parentElement?.parentElement?.dataset
            .field as 'title' | 'description' | 'caption'
        const val = e.currentTarget.value

        //2)
        if (field === 'title')
            setInputFields((state) => ({ ...state, title: val }))
        else if (field === 'description')
            setInputFields((state) => ({ ...state, description: val }))
        else if (field === 'caption')
            setInputFields((state) => ({ ...state, caption: val }))
    }

    //Click edit Handler
    const clickEditHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
        //1) Get
        const id = e.currentTarget.dataset.id
        const type = e.currentTarget.dataset.type as
            | 'title'
            | 'description'
            | 'caption'

        //2) Validate
        if (!id || !type) return

        //3) Dispatch action
        if (type === 'title') {
            return dispatch(editTitleStatus({ id }))
        } else if (type === 'description') {
            return dispatch(editDescriptionStatus({ id }))
        } else if (type === 'caption') {
            return dispatch(editCaptionStatus({ id }))
        }
    }

    //Click save handler
    const clickSaveHandler = () => {
        //1) Validate
        if (
            !selectedMedia ||
            !inputFields.title ||
            !inputFields.description ||
            !inputFields.caption
        )
            return

        //2) Dispatch action
        dispatch(
            updateMediaAsync({
                id: selectedMedia._id,
                data: {
                    title: inputFields.title,
                    description: inputFields.description,
                    caption: inputFields.caption,
                },
            })
        )
    }

    //Reset input field handler
    const resetInputFieldHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
        //1) Get
        const id = e.currentTarget.dataset.id
        const type = e.currentTarget.dataset.type as
            | 'title'
            | 'description'
            | 'caption'

        //2) Validate
        if (!id || !type || !selectedMedia) return

        //3) Dispatch action
        if (type === 'title') {
            inputFields.title = selectedMedia.title.value
        } else if (type === 'description') {
            inputFields.description = selectedMedia.description.value
        } else if (type === 'caption') {
            inputFields.caption = selectedMedia.caption.value
        }
    }

    //Click delete handler
    const clickDeleteHandler = () => {
        //1) Get id
        const ids = mediaFiles
            .filter((media) => media.isSelected)
            .map((media) => media._id)

        //2) Validate
        if (!ids || ids.length <= 0) return

        //3)Dispatch action
        dispatch(deleteMediaAsync(ids))
    }

    return (
        <EditMediaViewStyled>
            {!selectedMedia?._id ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Typography variant="h6">No Image Selected</Typography>
                    <Typography variant="body1">
                        Select an image to view the details here.
                    </Typography>
                </Box>
            ) : (
                <>
                    <ImageWrapper>
                        <img
                            src={selectedMedia?.url}
                            crossOrigin="anonymous"
                            alt={selectedMedia?.description.value}
                        />
                    </ImageWrapper>
                    <Box>
                        <Typography variant="h6">
                            {selectedMedia?.filename}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {selectedMedia?.size}
                        </Typography>
                    </Box>
                    <Box>
                        <RowInfo>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Information
                            </Typography>
                        </RowInfo>
                        <RowInfo>
                            <Typography variant="subtitle2" fontWeight={300}>
                                Uploaded by
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {selectedMedia?.uploaded_by.email}
                            </Typography>
                        </RowInfo>
                        <RowInfo>
                            <Typography fontWeight={300}>
                                Uploaded at
                            </Typography>
                            <Typography fontWeight="bold">
                                {selectedMedia &&
                                    new Date(
                                        selectedMedia.created_at
                                    ).toDateString()}
                            </Typography>
                        </RowInfo>
                        <RowInfo>
                            <Typography fontWeight={300}>Dimensions</Typography>
                            <Typography fontWeight="bold">
                                {selectedMedia?.dimensions.width} x{' '}
                                {selectedMedia?.dimensions.height}
                            </Typography>
                        </RowInfo>
                    </Box>
                    <Box>
                        <Row>
                            <Box sx={{ width: '100%' }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Title
                                </Typography>
                                {selectedMedia?.title.edit ||
                                mode === 'Edit' ? (
                                    <>
                                        <TextField
                                            fullWidth={true}
                                            value={inputFields.title}
                                            data-id={selectedMedia?._id}
                                            data-field="title"
                                            onChange={onChangeHandler}
                                        />
                                        {mode === 'View' && (
                                            <Row
                                                style={{
                                                    justifyContent:
                                                        'flex-start',
                                                }}
                                            >
                                                <Button
                                                    onClick={clickSaveHandler}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        clickEditHandler(e)
                                                        resetInputFieldHandler(
                                                            e
                                                        )
                                                    }}
                                                    data-id={selectedMedia?._id}
                                                    data-type="title"
                                                >
                                                    Cancel
                                                </Button>
                                            </Row>
                                        )}
                                    </>
                                ) : (
                                    <Typography
                                        sx={{
                                            lineHeight: '1.2em',
                                            maxHeight: '1.2em',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        {selectedMedia?.title.value ||
                                            'Add a title for this image.'}
                                    </Typography>
                                )}
                            </Box>
                            {!selectedMedia?.title.edit && mode === 'View' ? (
                                <IconButton
                                    data-id={selectedMedia?._id}
                                    data-type="title"
                                    onClick={clickEditHandler}
                                    size="small"
                                >
                                    <EditOutlined />
                                </IconButton>
                            ) : (
                                ''
                            )}
                        </Row>
                        <Row>
                            <Box sx={{ width: '100%' }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Description
                                </Typography>
                                {selectedMedia?.description.edit ||
                                mode === 'Edit' ? (
                                    <>
                                        <TextField
                                            fullWidth={true}
                                            value={inputFields.description}
                                            data-id={selectedMedia?._id}
                                            data-field="description"
                                            onChange={onChangeHandler}
                                        />
                                        {mode === 'View' && (
                                            <Row
                                                style={{
                                                    justifyContent:
                                                        'flex-start',
                                                }}
                                            >
                                                <Button
                                                    onClick={clickSaveHandler}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        clickEditHandler(e)
                                                        resetInputFieldHandler(
                                                            e
                                                        )
                                                    }}
                                                    data-id={selectedMedia?._id}
                                                    data-type="description"
                                                >
                                                    Cancel
                                                </Button>
                                            </Row>
                                        )}
                                    </>
                                ) : (
                                    <Typography
                                        sx={{
                                            lineHeight: '1.2em',
                                            maxHeight: '1.2em',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        {selectedMedia?.description.value ||
                                            'Add a detail description for this image.'}
                                    </Typography>
                                )}
                            </Box>
                            {!selectedMedia?.description.edit &&
                            mode === 'View' ? (
                                <IconButton
                                    size="small"
                                    data-id={selectedMedia?._id}
                                    data-type="description"
                                    onClick={clickEditHandler}
                                >
                                    <EditOutlined />
                                </IconButton>
                            ) : (
                                ''
                            )}
                        </Row>
                        <Row>
                            <Box sx={{ width: '100%' }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    Caption
                                </Typography>
                                {selectedMedia?.caption.edit ||
                                mode === 'Edit' ? (
                                    <>
                                        <TextField
                                            fullWidth={true}
                                            value={inputFields.caption}
                                            data-id={selectedMedia?._id}
                                            data-field="caption"
                                            onChange={onChangeHandler}
                                        />
                                        {mode === 'View' && (
                                            <Row
                                                style={{
                                                    justifyContent:
                                                        'flex-start',
                                                }}
                                            >
                                                <Button
                                                    onClick={clickSaveHandler}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    data-id={selectedMedia?._id}
                                                    data-type="caption"
                                                    onClick={(e) => {
                                                        clickEditHandler(e)
                                                        resetInputFieldHandler(
                                                            e
                                                        )
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Row>
                                        )}
                                    </>
                                ) : (
                                    <Typography
                                        sx={{
                                            lineHeight: '1.2em',
                                            maxHeight: '1.2em',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        {selectedMedia?.caption.value ||
                                            'Add a short caption for this image.'}
                                    </Typography>
                                )}
                            </Box>
                            {!selectedMedia?.caption.edit && mode === 'View' ? (
                                <IconButton
                                    size="small"
                                    data-id={selectedMedia?._id}
                                    data-type="caption"
                                    onClick={clickEditHandler}
                                >
                                    <EditOutlined />
                                </IconButton>
                            ) : (
                                ''
                            )}
                        </Row>
                    </Box>
                    {mode === 'View' ? (
                        <Button
                            sx={{ marginTop: 'auto' }}
                            fullWidth={true}
                            variant="contained"
                            color="error"
                            disableElevation={true}
                            size="large"
                            startIcon={<DeleteOutline />}
                            onClick={clickDeleteHandler}
                        >
                            Delete
                        </Button>
                    ) : (
                        <Row style={{ marginTop: 'auto' }}>
                            <Button
                                fullWidth={true}
                                variant="contained"
                                disableElevation={true}
                                size="large"
                                startIcon={<DeleteOutline />}
                                onClick={() => {
                                    clickSaveHandler()
                                    onClose && onClose()
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                fullWidth={true}
                                variant="outlined"
                                size="large"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </Row>
                    )}
                </>
            )}
        </EditMediaViewStyled>
    )
}

export default EditMediaView
