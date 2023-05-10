import { useState } from 'react'

import { PhotoCamera } from '@mui/icons-material'
import { CircularProgress, Typography, Button, Alert } from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppSelector, useAppDispatch } from '../../store/store'
import { IMediaDatabase, uploadMediaAsync } from '../../store/mediaReducer'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Upload Media View
const UploadMediaViewStyled = styled.div``

//Drop Item Box
const DropItemBox = styled.div`
    width: 100%;
    min-height: 300px;
    border: 1px solid ${(props) => props.theme.palette.grey['400']};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
`

//View Results
const ViewResults = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 16px;
`

/**
 ** ======================================================
 ** Component [UploadMediaView]
 ** ======================================================
 */
const UploadMediaView = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const [uplaodedFiles, setUploadedFiles] = useState<Array<IMediaDatabase>>(
        []
    )
    const [dropOverActive, setDropOverActive] = useState(false)

    //Redux
    const isLoading = useAppSelector((state) => state.media.isLoading)
    const dispatch = useAppDispatch()

    return (
        <UploadMediaViewStyled>
            <DropItemBox
                onDragOverCapture={(e) => {
                    e.preventDefault()
                    setDropOverActive(true)
                }}
                onDragExitCapture={() => setDropOverActive(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDropOverActive(false)

                    //1) Get files from event
                    const files = e.dataTransfer.files

                    //2) Validate
                    if (!files) return

                    //3) Create form data from files
                    const formData = new FormData()
                    Array.from(files).map((file) =>
                        formData.append('images', file)
                    )

                    //4) Dispatch action to upload files
                    dispatch(
                        uploadMediaAsync({
                            data: formData,
                            cb: (files) => {
                                setUploadedFiles([...uplaodedFiles, ...files])
                            },
                        })
                    )
                }}
            >
                {isLoading.create ? (
                    <CircularProgress size={80} />
                ) : dropOverActive ? (
                    <Typography>Drop files here...</Typography>
                ) : (
                    <>
                        <Typography variant="h5">
                            Drop files to upload
                        </Typography>
                        <Typography>or</Typography>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                            size="large"
                        >
                            Browse Files
                            <input
                                hidden
                                accept="image/*"
                                multiple
                                type="file"
                                onChange={(e) => {
                                    //1) Get files from event
                                    const files = e.currentTarget.files

                                    //2) Validate
                                    if (!files) return

                                    //3) Create form data from files
                                    const formData = new FormData()
                                    Array.from(files).map((file) =>
                                        formData.append('images', file)
                                    )

                                    //4) Dispatch action to upload files
                                    dispatch(
                                        uploadMediaAsync({
                                            data: formData,
                                            cb: (files) => {
                                                setUploadedFiles([
                                                    ...uplaodedFiles,
                                                    ...files,
                                                ])
                                            },
                                        })
                                    )
                                }}
                            />
                        </Button>
                    </>
                )}
            </DropItemBox>
            <ViewResults>
                {uplaodedFiles.map((media) => (
                    <Alert
                        onClose={() =>
                            setUploadedFiles((state) =>
                                state.filter((file) => file._id !== media._id)
                            )
                        }
                        severity="success"
                    >
                        {media.filename}{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            uploaded successfully!
                        </span>
                    </Alert>
                ))}
            </ViewResults>
        </UploadMediaViewStyled>
    )
}

export default UploadMediaView
