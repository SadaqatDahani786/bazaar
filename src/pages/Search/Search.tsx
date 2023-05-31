import { ChangeEvent, useRef, useState } from 'react'

import { PhotoAlbumOutlined } from '@mui/icons-material'
import {
    Card,
    Stack,
    TextField,
    Typography,
    Link,
    Skeleton,
    Box,
    Alert,
    AlertTitle,
} from '@mui/material'

import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import { searchProductAsync } from '../../store/productReducer'

//Components
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Search
const SearchStyled = styled.div``

//Section
const Section = styled.div`
    width: 100%;
    min-height: 80vh;
    padding: 80px 180px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 32px;
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${(props) => props.theme.palette.grey[300]};
    font-size: 2rem;

    & & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const Search = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const products = useAppSelector((state) => state.product.data)
    const isLoading = useAppSelector((state) => state.product.isLoading)
    const errors = useAppSelector((state) => state.product.errors)
    const dispatch = useAppDispatch()

    //State
    const [query, setQuery] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    const timeOutID = useRef<{ id: ReturnType<typeof setTimeout> | null }>({
        id: null,
    })

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //On search input change handler
    const onSearchInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        //1) Get query
        const query = e.currentTarget.value
        setQuery(query)

        //2) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //3) Set timeout to fetch products via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchProductAsync(query))
            setShowAlert(true)
        }, 300)
    }

    return (
        <SearchStyled>
            <Header />
            <Section>
                {showAlert && errors.fetch ? (
                    <Alert
                        variant="outlined"
                        severity="error"
                        onClose={() => setShowAlert(false)}
                    >
                        <AlertTitle>Error Occured!</AlertTitle>
                        {errors.fetch}
                    </Alert>
                ) : (
                    ''
                )}
                <TextField
                    label="Search products"
                    type="search"
                    fullWidth
                    onChange={onSearchInputChangeHandler}
                />

                <Stack gap="16px" width="60%">
                    <Typography variant="h5">Search Results: </Typography>
                    {query && isLoading.fetch ? (
                        [...new Array(3)].map((_, i) => (
                            <Stack
                                flexDirection="row"
                                alignItems="center"
                                key={i}
                                gap="8px"
                            >
                                <Box width="4rem" height="8rem">
                                    <Skeleton width="100%" height="100%" />
                                </Box>
                                <Stack flex={1}>
                                    <Skeleton variant="text" height="1rem" />
                                    <Skeleton variant="text" height=".5rem" />
                                    <Skeleton variant="text" height=".5rem" />
                                    <Skeleton variant="text" height=".5rem" />
                                    <Skeleton variant="text" height=".5rem" />
                                </Stack>
                            </Stack>
                        ))
                    ) : products.length <= 0 || !query ? (
                        <Typography>Uh oh! No search results found.</Typography>
                    ) : (
                        products.map((prod) => (
                            <Link
                                component={RouterLink}
                                to={`/product/${prod._id}`}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'center',
                                        padding: '8px',
                                    }}
                                >
                                    <ImageWrapper>
                                        {prod.image?.url ? (
                                            <img
                                                src={prod.image?.url}
                                                alt={prod.image?.title}
                                            />
                                        ) : (
                                            <PhotoAlbumOutlined
                                                color="secondary"
                                                fontSize="inherit"
                                            />
                                        )}
                                    </ImageWrapper>
                                    <Typography variant="h6">
                                        {prod.title}
                                    </Typography>
                                </Card>
                            </Link>
                        ))
                    )}
                </Stack>
            </Section>
            <Footer />
        </SearchStyled>
    )
}

export default Search
