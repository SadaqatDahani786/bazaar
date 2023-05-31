import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react'

import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    CircularProgress,
    InputAdornment,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import {
    ClearOutlined,
    DeleteOutline,
    DoneAll,
    GridView,
    SearchOutlined,
    ViewList,
} from '@mui/icons-material'

import styled from 'styled-components'

//Redux Store & Reducers
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import {
    clearSelection,
    deleteMediaAsync,
    editSelectedStatus,
    getMediaAsync,
    searchMediaAsync,
} from '../../../../store/mediaReducer'

//Components
import { EditMediaView } from '../../../../components/MediaPicker'
import MediaLibraryView from '../../../../components/MediaPicker/MediaLibraryView'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Media
const LibraryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 80px;
    width: 100%;
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

//Widget Wrapper
const WidgetWrapper = styled.div`
    display: flex;
    gap: 16px;
`

//Widget
const Widget = styled.div`
    padding: 24px;
    min-height: 800px;
    flex: 1;
    border: 1px solid black;
    text-align: left;

    &:nth-child(2) {
        flex: 0 0 30%;

        & > div {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }
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
 ** Component [Library]
 ** ======================================================
 */
const Library = () => {
    /**
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const {
        data: mediaFiles,
        isLoading,
        errors,
        count,
    } = useAppSelector((state) => state.media)
    const dispatch = useAppDispatch()

    //State
    const [isBulkSelectActive, setIsBulkSelectActive] = useState(false)
    const [isGridviewActive, setIsGridviewActive] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedMediaId, setSelectedMediaId] = useState<string>()
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    //Refs
    const timeOutID = useRef<{ id: ReturnType<typeof setTimeout> | null }>({
        id: null,
    })

    /**
     ** **
     ** ** ** Side effects
     ** **
     */
    //Clear selection when gridview to listview or vice-versa
    useEffect(() => {
        dispatch(clearSelection())
        setSelectedMediaId(undefined)
    }, [isGridviewActive])

    //Fetch media
    useEffect(() => {
        dispatch(
            getMediaAsync([
                {
                    key: 'page',
                    value: page.toString(),
                },
                {
                    key: 'limit',
                    value: rowsPerPage.toString(),
                },
            ])
        )
    }, [page, rowsPerPage])

    /**
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

        //4) Off bulk select
        setIsBulkSelectActive(false)
    }

    //Delete single handler
    const clickDeleteSingleHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
        //1) Get id
        const id = e.currentTarget.dataset.id

        //2) Validate
        if (!id) return

        //3)Dispatch action
        dispatch(deleteMediaAsync([id]))
    }

    //Search handler
    const onSearchInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        //1) Get query
        const query = e.currentTarget.value

        //2) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //3) Refetch media when query empty again
        if (!query || query.length <= 0) {
            return dispatch(
                getMediaAsync([
                    {
                        key: 'page',
                        value: page.toString(),
                    },
                    {
                        key: 'limit',
                        value: rowsPerPage.toString(),
                    },
                ])
            )
        }

        //4) Set timeout to fetch media via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchMediaAsync(query))
        }, 300)
    }

    //Click edit handler
    const clickEditHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
        //1) Get id
        const id = e.currentTarget.dataset.id

        //2) Validate
        if (!id) return

        //3) Set id and open modal
        setSelectedMediaId(id)
        setShowModal(true)
    }

    return (
        <LibraryStyled>
            <ControlBar>
                <Box>
                    <TextField
                        disabled={isBulkSelectActive}
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
                </Box>
                <Box sx={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
                    {isGridviewActive ? (
                        <Button
                            onClick={() => {
                                isBulkSelectActive && dispatch(clearSelection())
                                setIsBulkSelectActive((state) => !state)
                                setSelectedMediaId('dasd')
                            }}
                            variant="contained"
                            color="secondary"
                            disableElevation={true}
                            startIcon={
                                isBulkSelectActive ? (
                                    <ClearOutlined />
                                ) : (
                                    <DoneAll />
                                )
                            }
                        >
                            {isBulkSelectActive ? 'Cancel' : 'Select Images'}
                        </Button>
                    ) : (
                        <Button
                            onClick={clickDeleteHandler}
                            variant="contained"
                            color="secondary"
                            disableElevation={true}
                            startIcon={<DeleteOutline />}
                            disabled={mediaFiles.every(
                                (media) => !media.isSelected
                            )}
                        >
                            Delete Selected
                        </Button>
                    )}
                    <ButtonGroup
                        disabled={isBulkSelectActive}
                        variant="outlined"
                        disableElevation={true}
                    >
                        <Button
                            onClick={() => setIsGridviewActive(true)}
                            variant={
                                isGridviewActive ? 'contained' : 'outlined'
                            }
                        >
                            <GridView />
                        </Button>
                        <Button
                            onClick={() => setIsGridviewActive(false)}
                            variant={
                                isGridviewActive ? 'outlined' : 'contained'
                            }
                        >
                            <ViewList />
                        </Button>
                    </ButtonGroup>
                </Box>
            </ControlBar>
            {isGridviewActive ? (
                <WidgetWrapper>
                    {<MediaLibraryView selectMultiple={isBulkSelectActive} />}
                </WidgetWrapper>
            ) : (
                <WidgetWrapper>
                    <Widget style={{ minHeight: 'max-content' }}>
                        <Table
                            sx={{ minWidth: 650, overflowY: 'scroll' }}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            onChange={() => {
                                                const state = mediaFiles.every(
                                                    (m) => !m.isSelected
                                                )
                                                mediaFiles.map((mm) =>
                                                    dispatch(
                                                        editSelectedStatus({
                                                            id: mm._id,
                                                            bulkSelectActive:
                                                                true,
                                                            edit: state,
                                                        })
                                                    )
                                                )
                                            }}
                                            color="primary"
                                            indeterminate={
                                                mediaFiles.filter(
                                                    (media) => media.isSelected
                                                ).length > 0 &&
                                                mediaFiles.filter(
                                                    (media) => media.isSelected
                                                ).length < mediaFiles.length
                                            }
                                            checked={
                                                mediaFiles.filter(
                                                    (media) => media.isSelected
                                                ).length > 0 &&
                                                mediaFiles.filter(
                                                    (media) => media.isSelected
                                                ).length === mediaFiles.length
                                            }
                                            inputProps={{
                                                'aria-label':
                                                    'select all media files',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>File</TableCell>
                                    <TableCell align="right">Title</TableCell>
                                    <TableCell align="right">
                                        Dimensions
                                    </TableCell>
                                    <TableCell align="right">Author</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading.fetch ? (
                                    <CircularProgress size="24" />
                                ) : mediaFiles.length <= 0 ? (
                                    <TableCell colSpan={6}>
                                        <Typography variant="h6">
                                            Uh oh, no images found.
                                        </Typography>
                                    </TableCell>
                                ) : (
                                    mediaFiles.map((media) => (
                                        <TableRow
                                            key={media._id}
                                            sx={{
                                                '&:last-child td, &:last-child th':
                                                    {
                                                        border: 0,
                                                    },
                                            }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onChange={() =>
                                                        dispatch(
                                                            editSelectedStatus({
                                                                id: media._id,
                                                                bulkSelectActive:
                                                                    true,
                                                            })
                                                        )
                                                    }
                                                    color="primary"
                                                    checked={media.isSelected}
                                                    inputProps={{
                                                        'aria-labelledby': `select media file ${media._id}`,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: '8px',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <ImageWrapper
                                                        style={{
                                                            width: '48px',
                                                            height: '48px',
                                                        }}
                                                    >
                                                        <img
                                                            crossOrigin="anonymous"
                                                            src={media.url}
                                                            alt={
                                                                media
                                                                    .description
                                                                    .value
                                                            }
                                                        />
                                                    </ImageWrapper>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            gap: '4px',
                                                        }}
                                                    >
                                                        <Typography variant="body1">
                                                            {media.filename}
                                                        </Typography>
                                                        <ButtonGroup
                                                            variant="text"
                                                            size="small"
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                        >
                                                            <Button
                                                                data-id={
                                                                    media._id
                                                                }
                                                                onClick={
                                                                    clickEditHandler
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                data-id={
                                                                    media._id
                                                                }
                                                                disabled={
                                                                    isLoading.delete
                                                                }
                                                                onClick={
                                                                    clickDeleteSingleHandler
                                                                }
                                                            >
                                                                {isLoading.delete ? (
                                                                    <CircularProgress
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ) : (
                                                                    'Delete'
                                                                )}
                                                            </Button>
                                                        </ButtonGroup>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                {media.title.value || '-- --'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {media.dimensions.width}x
                                                {media.dimensions.height}
                                            </TableCell>
                                            <TableCell align="right">
                                                {media.uploaded_by?.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Date(
                                                    media.created_at
                                                ).toDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={7} align="right">
                                        <TablePagination
                                            component="div"
                                            count={count}
                                            page={page - 1}
                                            onPageChange={(e, newPage) =>
                                                setPage(newPage + 1)
                                            }
                                            onRowsPerPageChange={(e) => {
                                                setRowsPerPage(
                                                    parseInt(e.target.value, 10)
                                                )
                                                setPage(1)
                                            }}
                                            rowsPerPage={rowsPerPage}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Widget>
                    {selectedMediaId && (
                        <Modal
                            onClose={() => setShowModal(false)}
                            open={showModal}
                        >
                            <Box
                                sx={{
                                    marginTop: '5%',
                                    marginLeft: '50%',
                                    transform: 'translate(-50%, -5%)',
                                    maxWidth: '600px',
                                    height: '90%',
                                    overflow: 'scroll',
                                    padding: '24px',
                                    background: 'white',
                                }}
                            >
                                <EditMediaView
                                    id={selectedMediaId}
                                    onClose={() => setShowModal(false)}
                                    mode="Edit"
                                />
                            </Box>
                        </Modal>
                    )}
                </WidgetWrapper>
            )}
        </LibraryStyled>
    )
}

export default Library
