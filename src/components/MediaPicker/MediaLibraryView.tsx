import { SyntheticEvent, useEffect, useState } from 'react'

import { DeleteOutline } from '@mui/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Stack,
    Typography,
    useTheme,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import {
    deleteMediaAsync,
    editSelectedStatus,
    getMediaAsync,
} from '../../store/mediaReducer'

//Components
import EditMediaView from './EditMediaView'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Media Library View
const MediaLibraryViewStyled = styled.div`
    display: flex;
    height: 100%;
    gap: 16px;
    text-align: left;
    padding: 16px;
    padding-bottom: 40px;
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
 ** Component [MediaLibraryView]
 ** ======================================================
 */
const MediaLibraryView = ({ selectMultiple }: { selectMultiple: boolean }) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const mediaFiles = useAppSelector((state) => state.media.data)
    const isLoading = useAppSelector((state) => state.media.isLoading)
    const dispatch = useAppDispatch()

    const [selectedMediaId, setSelectedMediaId] = useState<string>()
    const theme = useTheme()

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    useEffect(() => {
        dispatch(getMediaAsync())
    }, [])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Delete handler
    const clickDeleteHandler = () => {
        //1) Get id
        const ids = mediaFiles
            .filter((media) => media.isSelected)
            .map((media) => media._id)

        //2) Validate
        if (!ids || ids.length <= 0) return

        //3)Dispatch action
        dispatch(deleteMediaAsync(ids))

        // //4) Off bulk select
        // setIsBulkSelectActive(false)
    }

    //Select image handler
    const selectImageHandler = (e: SyntheticEvent<HTMLDivElement>) => {
        //1) Get id
        const id = e.currentTarget.dataset.id

        //2) Validate
        if (!id) return

        //3) Set id of selected media
        setSelectedMediaId(id)

        //4) Dispatch action
        dispatch(
            editSelectedStatus({
                id: id,
                bulkSelectActive: selectMultiple,
            })
        )
    }

    return (
        <MediaLibraryViewStyled>
            <Stack flex="0 0 70%">
                {isLoading.fetch || mediaFiles.length <= 0 ? (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {isLoading.fetch ? (
                            <CircularProgress size={80} />
                        ) : (
                            <Typography variant="h6">
                                Uh oh, no images found.
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <Grid container spacing={1}>
                        {mediaFiles.map((file) => (
                            <Grid
                                sx={{ cursor: 'pointer ' }}
                                onClick={selectImageHandler}
                                key={file._id}
                                item
                                lg={3}
                                md={4}
                                sm={6}
                                xs={12}
                                data-id={file._id}
                            >
                                <ImageWrapper
                                    style={{
                                        opacity: selectMultiple ? '.8' : '1',
                                        border: file.isSelected
                                            ? '5px solid #39c'
                                            : 'none',
                                    }}
                                >
                                    <img
                                        src={file.url}
                                        crossOrigin="anonymous"
                                        alt={file.description.value}
                                    />
                                </ImageWrapper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Stack>
            <Stack
                flex="0 0 30%"
                sx={{
                    height: '100%',
                }}
            >
                {selectMultiple ? (
                    <Stack
                        overflow="scroll"
                        sx={{
                            height: '90%',
                            border: `1px solid ${theme.palette.grey['400']}`,
                            padding: '16px',
                        }}
                        gap="32px"
                    >
                        <Typography variant="h5">
                            (
                            {
                                mediaFiles.filter((media) => media.isSelected)
                                    .length
                            }
                            ) Files Selected
                        </Typography>
                        <Stack gap="8px">
                            {mediaFiles
                                .filter((media) => media.isSelected)
                                .map((media) => (
                                    <Stack
                                        key={media._id}
                                        gap="16px"
                                        style={{
                                            padding: '8px',
                                            border: `1px solid ${theme.palette.grey['300']}`,
                                        }}
                                    >
                                        <ImageWrapper
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                            }}
                                        >
                                            <img
                                                crossOrigin="anonymous"
                                                src={media.url}
                                                alt={media.caption.value}
                                            />
                                        </ImageWrapper>
                                        <Typography>
                                            {media.filename}
                                        </Typography>
                                    </Stack>
                                ))}
                        </Stack>
                        <Button
                            sx={{ marginTop: 'auto' }}
                            fullWidth={true}
                            variant="contained"
                            color="error"
                            disableElevation={true}
                            startIcon={<DeleteOutline />}
                            onClick={clickDeleteHandler}
                            size="large"
                            disabled={
                                !mediaFiles.some((media) => media.isSelected)
                            }
                        >
                            Delete (
                            {
                                mediaFiles.filter((media) => media.isSelected)
                                    .length
                            }
                            )
                        </Button>
                    </Stack>
                ) : (
                    <EditMediaView id={selectedMediaId} mode="View" />
                )}
            </Stack>
        </MediaLibraryViewStyled>
    )
}

export default MediaLibraryView
