import { ChangeEvent, useEffect, useRef, useState } from 'react'

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

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import {
    deleteCategoryAsync,
    editSelectedStatus,
    getManyCategoryAsync,
    searchCategoryAsync,
} from '../../../../store/categoryReducer'

//Components
import CategoryView from './CategoryView'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
const CategoriesStyled = styled.div`
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
    width: 100%;
    min-height: 400px;
    border: 1px solid black;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 48px;
    height: 48px;
    background: #a7a7a7;
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
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
 ** Component [Categories]
 ** ======================================================
 */
const Categories = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const categories = useAppSelector((state) => state.category.data)
    const isLoading = useAppSelector((state) => state.category.isLoading)
    const errors = useAppSelector((state) => state.category.errors)
    const dispatch = useAppDispatch()

    const [selectedCat, setSelectedCat] = useState<string>()
    const [showModal, setShowModal] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const timeOutID = useRef<{ id: ReturnType<typeof setTimeout> | null }>({
        id: null,
    })

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Get many categories async
    useEffect(() => {
        dispatch(getManyCategoryAsync([]))
        setShowAlert(true)
    }, [])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click selete all handler
    const clickSelectAllHandler = () => {
        //1) Determine state
        const state = categories.every((cat) => !cat.isSelected)

        //2) Dispatch action
        dispatch(
            editSelectedStatus({
                ids: categories.map((cat) => cat._id),
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
        const ids = categories
            .filter((cat) => cat.isSelected)
            .map((cat) => cat._id)

        //2) Dispatch action to delete categories
        dispatch(deleteCategoryAsync({ ids, cb: () => '' }))
    }

    //On search input change handler
    const onSearchInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        //1) Get query
        const query = e.currentTarget.value

        //2) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //3) Refetch users when query empty again
        if (!query || query.length <= 0) {
            return dispatch(getManyCategoryAsync([]))
        }

        //4) Set timeout to fetch user via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchCategoryAsync(query))
        }, 300)
    }

    return (
        <CategoriesStyled>
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
                                categories.every((cat) => !cat.isSelected) ||
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
                        <Typography variant="h5">Categories</Typography>
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
                                            categories.filter(
                                                (categories) =>
                                                    categories.isSelected
                                            ).length > 0 &&
                                            categories.filter(
                                                (categories) =>
                                                    categories.isSelected
                                            ).length < categories.length
                                        }
                                        checked={
                                            categories.filter(
                                                (media) => media.isSelected
                                            ).length > 0 &&
                                            categories.filter(
                                                (media) => media.isSelected
                                            ).length === categories.length
                                        }
                                        inputProps={{
                                            'aria-label':
                                                'select all media files',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="left">Description</TableCell>
                                <TableCell align="right">Slug</TableCell>
                                <TableCell align="right">Parent</TableCell>
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
                            ) : categories.length <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Typography variant="h6">
                                            Uh oh! No categories found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((cat) => (
                                    <TableRow key={cat._id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={cat.isSelected}
                                                onChange={() =>
                                                    clickSelectHandler(cat._id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack
                                                flexDirection="row"
                                                justifyContent="flex-start"
                                                gap="16px"
                                            >
                                                <ImageWrapper>
                                                    {cat?.image?.url ? (
                                                        <img
                                                            src={
                                                                cat?.image?.url
                                                            }
                                                            alt={
                                                                cat.image.title
                                                            }
                                                            crossOrigin="anonymous"
                                                        />
                                                    ) : (
                                                        <PhotoAlbumOutlined
                                                            fontSize="large"
                                                            color="secondary"
                                                        />
                                                    )}
                                                </ImageWrapper>
                                                <Stack
                                                    alignItems="flex-start"
                                                    gap="8px"
                                                >
                                                    {cat.name}
                                                    <ButtonGroup
                                                        size="small"
                                                        variant="text"
                                                    >
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedCat(
                                                                    cat._id
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
                                                                selectedCat ===
                                                                    cat._id
                                                            }
                                                            onClick={() => {
                                                                setSelectedCat(
                                                                    cat._id
                                                                )
                                                                dispatch(
                                                                    deleteCategoryAsync(
                                                                        {
                                                                            ids: [
                                                                                cat._id,
                                                                            ],
                                                                        }
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            {isLoading.delete &&
                                                            selectedCat ===
                                                                cat._id ? (
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
                                            {cat.description.length > 200
                                                ? cat.description.slice(
                                                      0,
                                                      200
                                                  ) + '...'
                                                : cat.description}
                                        </TableCell>
                                        <TableCell align="right">
                                            {cat.slug}
                                        </TableCell>
                                        <TableCell align="right">
                                            {cat?.parent?.name || '-- --'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Date(
                                                cat.created_at
                                            ).toDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Widget>
                <Widget>
                    <Typography textAlign="left" variant="h5">
                        Add a new category
                    </Typography>
                    <CategoryView />
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
                    <Typography variant="h5">Edit Category</Typography>
                    <CategoryView mode="EDIT" categoryId={selectedCat} />
                </ModalInnerContainer>
            </Modal>
        </CategoriesStyled>
    )
}

export default Categories
