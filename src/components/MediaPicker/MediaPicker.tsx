import { useEffect, useState } from 'react'

import { PhotoCamera } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    Modal,
    Stack,
    SxProps,
    Tab,
    Tabs,
    Typography,
    useTheme,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import {
    clearSelection,
    editSelectedStatus,
    getMediaAsync,
    IMedia,
    IMediaDatabase,
} from '../../store/mediaReducer'
import { useAppDispatch, useAppSelector } from '../../store/store'

//Components
import MediaLibraryView from './MediaLibraryView'
import UploadMediaView from './UploadMediaView'
import { ICategory } from '../../store/categoryReducer'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Media Picker
const MediaPickerStyled = styled.div`
    width: 100%;
    height: 100%;
`

//Modal Inner Container
const ModalInnerContainer = styled.div`
    min-width: 95%;
    max-width: 1600px;
    height: 95vh;
    background: ${(props) => props.theme.palette.secondary.main};
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    overflow: hidden;
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
    sx?: SxProps
}

/**
 ** ======================================================
 ** Component [TabPanel]
 ** ======================================================
 */
const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ height: '100%' }}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, height: '100%' }}>{children}</Box>
            )}
        </div>
    )
}

/**
 ** ======================================================
 ** Interface [MediaPickerProps]
 ** ======================================================
 */
interface MediaPickerProps {
    default_selected?: ICategory
    selectMultiple?: boolean
    headingTitle?: string
    buttonText?: string
    modalButtonText?: string
    onSelect?: (selectedFiles: Array<IMedia>) => void
    onClearSelection?: (cb: () => void) => void
}

/**
 ** ======================================================
 ** Component [MediaPicker]
 ** ======================================================
 */
const MediaPicker = ({
    default_selected,
    selectMultiple = false,
    headingTitle = 'Select or add new images',
    buttonText = 'Pick Image',
    modalButtonText = 'Add Image',
    onSelect = () => '',
    onClearSelection,
}: MediaPickerProps) => {
    /*s
     ** **
     ** ** ** Hooks & States
     ** **
     */
    //Redux
    const mediaFiles = useAppSelector((state) => state.media.data)
    const dispatch = useAppDispatch()

    //State
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const [activeTab, setActiveTab] = useState(1)
    const [selectedMediaFiles, setSelectedMediaFiles] = useState<
        Array<IMediaDatabase>
    >([])

    //Fetch media files
    useEffect(() => {
        dispatch(getMediaAsync())
    }, [])

    //Set default values
    useEffect(() => {
        //1) Validate
        if (!default_selected?.image) return

        //2) Set default image
        setSelectedMediaFiles([default_selected.image])
    }, [default_selected])

    //Sync state with redux media pickers open up
    useEffect(() => {
        if (!showMediaPicker) return

        //Sync local state of selected files to redux state
        selectedMediaFiles.map((media) =>
            dispatch(
                editSelectedStatus({
                    id: media._id,
                    bulkSelectActive: false,
                    edit: true,
                })
            )
        )
    }, [showMediaPicker, selectedMediaFiles])

    //Theme
    const theme = useTheme()

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click add image handler
    const clickAddImageHandler = () => {
        //1) Get selected images
        const images = mediaFiles.filter((media) => media.isSelected)

        //2) Set selected
        setSelectedMediaFiles(
            images.map((med) => ({
                ...med,
                title: med.title.value,
                description: med.description.value,
                caption: med.caption.value,
            }))
        )

        //2) Deselect all images
        dispatch(clearSelection())

        //3) Pass selected images ids to func
        onSelect(images)

        //4) Hide modal
        setShowMediaPicker(false)
    }

    //Click remove selection handler
    const clickRemoveSelectionHandler = () => {
        //1) Clear from redux storage
        dispatch(clearSelection())

        //2) Clear from local state
        setSelectedMediaFiles([])
    }

    useEffect(() => {
        onClearSelection &&
            onClearSelection(() => clickRemoveSelectionHandler())
    }, [])

    return (
        <MediaPickerStyled>
            <Stack flexDirection="row" alignItems="center" gap="16px">
                <Stack>
                    <Box>
                        <IconButton onClick={() => setShowMediaPicker(true)}>
                            <PhotoCamera />
                        </IconButton>
                    </Box>
                    {selectedMediaFiles?.length <= 0 ? (
                        <Typography>{buttonText}</Typography>
                    ) : (
                        <Button
                            size="small"
                            onClick={clickRemoveSelectionHandler}
                        >
                            Remove selection
                        </Button>
                    )}
                </Stack>
                <Stack flexDirection="row" gap="8px" flexWrap="wrap">
                    {selectedMediaFiles?.map((media) => (
                        <Box
                            key={media._id}
                            sx={{ width: '40px', height: '40px' }}
                        >
                            <img
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                src={media.url}
                                crossOrigin="anonymous"
                            />
                        </Box>
                    ))}
                </Stack>
            </Stack>
            <Modal
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                open={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
            >
                <ModalInnerContainer>
                    <Typography variant="h5">{headingTitle}</Typography>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, val) => setActiveTab(val)}
                            aria-label="basic tabs example"
                        >
                            <Tab label="Upload Media" />
                            <Tab label="Media Library" />
                        </Tabs>
                    </Box>
                    <TabPanel value={activeTab} index={0}>
                        <UploadMediaView />
                    </TabPanel>
                    <TabPanel
                        sx={{ height: '100%' }}
                        value={activeTab}
                        index={1}
                    >
                        <MediaLibraryView selectMultiple={selectMultiple} />
                    </TabPanel>
                    <Stack
                        position="fixed"
                        bottom="calc(5vh / 2)"
                        left="calc(5% / 2)"
                        alignItems="flex-end"
                        justifyContent="center"
                        sx={{
                            width: '95%',
                            height: '72px',
                            borderTop: `1px solid ${theme.palette.grey['400']}`,
                            background: theme.palette.secondary.main,
                            padding: '16px',
                        }}
                    >
                        <Box>
                            <Button
                                onClick={clickAddImageHandler}
                                disabled={
                                    !mediaFiles.some(
                                        (media) => media.isSelected
                                    )
                                }
                                variant="contained"
                            >
                                {modalButtonText}
                            </Button>
                        </Box>
                    </Stack>
                </ModalInnerContainer>
            </Modal>
        </MediaPickerStyled>
    )
}

export default MediaPicker
