import { ChangeEvent, useEffect, useRef, useState } from 'react'

import {
    SearchOutlined,
    DeleteOutline,
    PhotoAlbumOutlined,
} from '@mui/icons-material'
import {
    Stack,
    TextField,
    InputAdornment,
    Button,
    CircularProgress,
    Alert,
    AlertTitle,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Checkbox,
    TableBody,
    ButtonGroup,
    Divider,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import {
    deleteProductAsync,
    editSelectedStatus,
    getManyProductAsync,
    IProduct,
    searchProductAsync,
} from '../../../../store/productReducer'
import { useNavigate } from 'react-router-dom'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//All Products
const AllProductsStyled = styled.div`
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
 ** Component [AllProducts]
 ** ======================================================
 */
const AllProducts = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const {
        data: products,
        isLoading,
        errors,
    } = useAppSelector((state) => state.product)
    const dispatch = useAppDispatch()

    //State
    const [showAlert, setShowAlert] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<IProduct>()

    //Nav
    const navigate = useNavigate()

    //Refs
    const timeOutID = useRef<{ id: ReturnType<typeof setTimeout> | null }>({
        id: null,
    })

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch products when component loads up first time
    useEffect(() => {
        dispatch(getManyProductAsync())
    }, [])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click selete all handler
    const clickSelectAllHandler = () => {
        //1) Determine state
        const state = products.every((prod) => !prod.isSelected)

        //2) Dispatch action
        dispatch(
            editSelectedStatus({
                ids: products.map((prod) => prod._id),
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
        //1) Get ids of selected products
        const ids = products
            .filter((prod) => prod.isSelected)
            .map((prod) => prod._id)

        //2) Dispatch action to delete products
        dispatch(deleteProductAsync({ ids, cb: () => '' }))
    }

    //On search input change handler
    const onSearchInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        //1) Get query
        const query = e.currentTarget.value

        //2) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //3) Refetch products when query empty again
        if (!query || query.length <= 0) {
            return dispatch(getManyProductAsync())
        }

        //4) Set timeout to fetch products via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchProductAsync(query))
        }, 300)
    }

    return (
        <AllProductsStyled>
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
                                products.every((prod) => !prod.isSelected) ||
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
                        <Typography variant="h5">Products</Typography>
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
                                            products.filter(
                                                (products) =>
                                                    products.isSelected
                                            ).length > 0 &&
                                            products.filter(
                                                (products) =>
                                                    products.isSelected
                                            ).length < products.length
                                        }
                                        checked={
                                            products.filter(
                                                (media) => media.isSelected
                                            ).length > 0 &&
                                            products.filter(
                                                (media) => media.isSelected
                                            ).length === products.length
                                        }
                                        inputProps={{
                                            'aria-label':
                                                'select all media files',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Sku</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Categories</TableCell>
                                <TableCell align="right">Stock</TableCell>
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
                            ) : products.length <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Typography variant="h6">
                                            Uh oh! No products found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((prod) => (
                                    <TableRow key={prod._id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={prod.isSelected}
                                                onChange={() =>
                                                    clickSelectHandler(prod._id)
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
                                                    {prod?.image?.url ? (
                                                        <img
                                                            src={
                                                                prod?.image?.url
                                                            }
                                                            alt={
                                                                prod.image.title
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
                                                    {prod.title}
                                                    <ButtonGroup
                                                        size="small"
                                                        variant="text"
                                                    >
                                                        <Button
                                                            onClick={() => {
                                                                navigate(
                                                                    `/dashboard/edit-product?id=${prod._id}`
                                                                )
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Divider />
                                                        <Button
                                                            disabled={
                                                                isLoading.delete &&
                                                                selectedProduct?._id ===
                                                                    prod._id
                                                            }
                                                            onClick={() => {
                                                                setSelectedProduct(
                                                                    prod
                                                                )
                                                                dispatch(
                                                                    deleteProductAsync(
                                                                        {
                                                                            ids: [
                                                                                prod._id,
                                                                            ],
                                                                        }
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            {isLoading.delete &&
                                                            selectedProduct?._id ===
                                                                prod._id ? (
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
                                        <TableCell align="right">
                                            {prod.sku}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack>
                                                €
                                                {prod?.selling_price
                                                    ? prod.selling_price.toFixed(
                                                          2
                                                      )
                                                    : prod.price.toFixed(2)}
                                                <Typography
                                                    sx={{
                                                        textDecoration:
                                                            'line-through',
                                                    }}
                                                    variant="overline"
                                                >
                                                    {prod?.selling_price
                                                        ? '€' +
                                                          prod.price.toFixed(2)
                                                        : ''}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            {prod.categories
                                                .map((cat) => cat.name)
                                                .join(', ') || '-- --'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {prod.stock}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Date(
                                                prod.created_at
                                            ).toDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Widget>
            </Stack>
        </AllProductsStyled>
    )
}

export default AllProducts
