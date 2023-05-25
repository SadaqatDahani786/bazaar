import { useEffect, useState } from 'react'

import {
    AddOutlined,
    EditOutlined,
    HomeOutlined,
    PhotoAlbumOutlined,
    Remove,
    ShoppingCart,
    Star,
    StarOutline,
} from '@mui/icons-material'
import {
    Box,
    Breadcrumbs,
    Button,
    ButtonGroup,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Link,
    Modal,
    Radio,
    Rating,
    Stack,
    Table,
    TableCell,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'

import styled from 'styled-components'
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom'
import { GenericFormData } from 'axios'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import {
    getItemsBoughtTogetherAsync,
    getProductAsync,
    IProduct,
} from '../../store/productReducer'
import {
    createUserProductReviewAsync,
    deleteReviewAsync,
    deleteUserProductReviewAsync,
    getManyReviewAsync,
    getRatingsOfProductAsync,
    getUserProductReviewAsync,
    IReview,
    updateReviewAsync,
    updateUserProductReviewAsync,
} from '../../store/reviewReducer'
import { addItemInUserCartAsync } from '../../store/cartReducer'
import { IMediaDatabase } from '../../store/mediaReducer'

//Components
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'
import Pill from '../../components/Pill'
import AddReviewView from './AddReviewView'
import Review from '../../components/Review'
import ProductCardList from '../../components/Product Card List'

//Hooks & Func
import { calcAverageRatings } from '../../utils/calcAverageRatings'
import { calcDiscount } from '../../utils/calcDiscount'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Product
const ProductStyled = styled.div``

//Toolbar
const Toolbar = styled.div`
    height: 5rem;
    padding: 0 180px;
    border-top: 1px solid #0000002f;
    border-bottom: 1px solid #0000002f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 32px;
`

//Product Info
const ProductInfo = styled.div`
    width: 100%;
    display: flex;
    gap: 16px;
    padding: 48px 0;
    text-align: left;

    & > :nth-child(1) {
        flex: 0 0 60%;
    }

    & > :nth-child(2) {
        flex: 0 0 40%;
    }
`

//Product Details
const ProductDetails = styled.div`
    padding: 148px 48px;
    background: ${(props) => props.theme.palette.grey['300']};
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 80px;
`

//Details
const Details = styled.div`
    padding-left: 16px;
    padding-right: 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
`

//Image Wrapper
const ImageWrapper = styled.div`
    width: 100%;
    height: 40rem;
    overflow: hidden;
    background: ${(props) => props.theme.palette.grey['300']};
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

//Variant Image Button
const VariantImageButton = styled(ImageWrapper)`
    width: 3.4rem;
    height: 3.4rem;
    cursor: pointer;
    padding: 1px;
`

//Modal innerContainer
const ModalInnerContainer = styled.div`
    padding: 48px;
    min-width: 600px;
    max-width: 800px;
    border-radius: 8px;
    max-height: 90vh;
    overflow-y: auto;
    background: ${(props) => props.theme.palette.secondary.main};
`

/**
 ** ======================================================
 ** Component [Product]
 ** ======================================================
 */
const Product = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const user = useAppSelector((state) => state.auth.data)
    const { data: reviews, count } = useAppSelector((state) => state.review)
    const isLoadingReview = useAppSelector((state) => state.review.isLoading)
    const { isLoading } = useAppSelector((state) => state.cart)
    const dispatch = useAppDispatch()

    //State
    const [product, setProduct] = useState<IProduct>()
    const [quantity, setQuantity] = useState(0)
    const [page, setPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [itemsBoughtTogether, setItemsBoughtTogether] = useState<
        { image: IMediaDatabase; product: IProduct; sold: number }[]
    >([])
    const [ratings, setRatings] = useState<
        {
            product: string
            ratings: {
                rating_star: number
                ratings_count: number
            }[]
        }[]
    >([])
    const [variants, setVariants] = useState(
        product?.variants.map((variant) => ({
            ...variant,
            selectedTerm: variant.terms[0].name,
        }))
    )
    const [allReviews, setAllReviews] = useState<IReview[]>([])
    const [userReview, setUserReview] = useState<IReview>()

    //Hooks
    const params = useParams()
    const theme = useTheme()
    const navigate = useNavigate()

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch product and ratings
    useEffect(() => {
        //Empty reviews
        setAllReviews([])

        //1) Get id
        const prodId = params.id

        //2) Validate
        if (!prodId) return

        //3) Fetch product
        dispatch(
            getProductAsync({
                id: prodId,
                cb(prod) {
                    //=>  Set products and product variations
                    if (prod) {
                        setProduct(prod)
                        setVariants(
                            prod.variants.map((variant) => ({
                                ...variant,
                                selectedTerm: variant.terms[0].name,
                            }))
                        )
                    }
                },
            })
        )

        //4) Fetch product review async
        dispatch(
            getUserProductReviewAsync({
                id: prodId,
                cb: (review) => {
                    if (review) setUserReview(review)
                },
            })
        )

        //5) Fetch frequently bought together items
        dispatch(
            getItemsBoughtTogetherAsync({
                id: prodId,
                cb: (items) => {
                    if (items) {
                        setItemsBoughtTogether([...items])
                    }
                },
            })
        )
    }, [])

    //Fetch ratings of products
    useEffect(() => {
        if (!params.id) return

        //=> Fetch product ratings
        dispatch(
            getRatingsOfProductAsync({
                ids: [params.id],
                cb: (res) => {
                    setRatings(res)
                },
            })
        )
    }, [reviews])

    //Fetch product reviews
    useEffect(() => {
        if (!product) return

        dispatch(
            getManyReviewAsync([
                { key: 'product', value: product._id },
                { key: 'limit', value: '10' },
                { key: 'page', value: page.toString() },
            ])
        )
    }, [page, product])

    //Set Reviews
    useEffect(() => {
        //1) No review, return early
        if (reviews.length <= 0) return

        //2) Avoid duplicates
        const noDuplicates = reviews.filter((review) =>
            allReviews.every((rev) => rev._id !== review._id)
        )

        //3) Set reviews for current page
        setAllReviews((state) => [...state, ...noDuplicates])
    }, [reviews])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Set variants with new values
    const variantSelector = (name: string, term: string) => {
        //1) Make changes
        const updatedVariant = variants?.map((currVar) => {
            if (currVar.name === name)
                return {
                    ...currVar,
                    selectedTerm: term,
                }
            return currVar
        })

        //2) Update
        setVariants(updatedVariant)
    }

    //Calculate ratings percentage of given star
    const calcRatingsPercentage = (star: number) => {
        const rating =
            ((ratings
                .find((rating) => rating.product === product?._id)
                ?.ratings.find((rating) => rating.rating_star === star)
                ?.ratings_count || 0) *
                100) /
            calcAverageRatings(
                ratings.find((rating) => rating.product === product?._id)
                    ?.ratings || []
            ).total

        return isNaN(rating) ? 0 : Math.round(rating)
    }

    //Delete my review handler
    const deleteMyReviewHandler = () => {
        //1) Validate
        if (!userReview) return

        //2) if admin user, delete with admin route
        if (user?.role === 'admin') {
            return dispatch(
                deleteReviewAsync({
                    ids: [userReview._id],
                    cb: () => setUserReview(undefined),
                })
            )
        }

        //3) else delete with user route
        dispatch(
            deleteUserProductReviewAsync({
                id: userReview._id,
                cb: () => setUserReview(undefined),
            })
        )
    }

    //Update my review handler
    const updateMyReviewHandler = (
        formData: GenericFormData,
        closeEditMode: () => void
    ) => {
        //1) Validate
        if (!userReview) return

        //2) if admin user, update with admin route
        if (user?.role === 'admin') {
            return dispatch(
                updateReviewAsync({
                    id: userReview._id,
                    formData,
                    cb: (updatedReview) => {
                        if (updatedReview) setUserReview(updatedReview)
                        closeEditMode()
                    },
                })
            )
        }

        //3) else update with user route
        if (!product) return
        dispatch(
            updateUserProductReviewAsync({
                id: product._id,
                formData,
                cb: (updatedReview) => {
                    if (updatedReview) setUserReview(updatedReview)
                    closeEditMode()
                },
            })
        )
    }

    //Save my review handler
    const saveMyReviewHandler = (formData: GenericFormData) => {
        //1) Validate
        if (!product) return

        //2) Dispatch action to create user
        dispatch(
            createUserProductReviewAsync({
                id: product._id,
                formData,
                cb: (review) => {
                    if (review) setUserReview(review)

                    setShowModal(false)
                },
            })
        )
    }

    //Add item int to cart handler
    const clickAddToCartHandler = () => {
        if (!product || !quantity) return

        //1) Create form data
        const data = {
            product: product._id,
            quantity: quantity,
            selected_variants:
                variants?.map((variant) => ({
                    name: variant.name,
                    term: variant.selectedTerm,
                })) || [],
        }

        //3) Dispatch action to add item into the cart
        dispatch(addItemInUserCartAsync({ data, cb: () => undefined }))
    }

    return (
        <ProductStyled>
            <Header />
            <Toolbar>
                <Breadcrumbs>
                    <Link
                        component={RouterLink}
                        to="/"
                        color="inherit"
                        underline="hover"
                    >
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap="4px"
                        >
                            <HomeOutlined /> Home
                        </Stack>
                    </Link>
                    <Typography color="primary">{product?.title}</Typography>
                </Breadcrumbs>
            </Toolbar>
            <ProductInfo>
                <Grid container spacing={2}>
                    <Grid item lg={6} md={12}>
                        <ImageWrapper style={{ fontSize: '10rem' }}>
                            {product?.image?.url ? (
                                <img
                                    src={product?.image?.url}
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <PhotoAlbumOutlined
                                    color="secondary"
                                    fontSize="inherit"
                                />
                            )}
                        </ImageWrapper>
                    </Grid>
                    {product?.image_gallery &&
                    product?.image_gallery?.length > 0 ? (
                        product?.image_gallery?.map((img) => (
                            <Grid item lg={6} md={12}>
                                <ImageWrapper key={img._id}>
                                    <img
                                        src={img.url}
                                        crossOrigin="anonymous"
                                    />
                                </ImageWrapper>
                            </Grid>
                        ))
                    ) : (
                        <Grid item lg={6} md={12}>
                            <ImageWrapper style={{ fontSize: '10rem' }}>
                                <PhotoAlbumOutlined
                                    color="secondary"
                                    fontSize="inherit"
                                />
                            </ImageWrapper>
                        </Grid>
                    )}
                </Grid>
                <Details>
                    <Stack gap="8px">
                        <Typography variant="h4">{product?.title}</Typography>
                        <Stack
                            flexDirection="row"
                            gap="8px"
                            alignItems="flex-start"
                        >
                            <Typography fontWeight="bold" variant="body1">
                                Categories:
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {product?.categories
                                    .map((cat) => cat.name)
                                    .join(', ')}
                                .
                            </Typography>
                        </Stack>
                        <Stack flexDirection="row" gap="32px">
                            <Stack flexDirection="row" gap="8px">
                                <Rating
                                    value={
                                        ratings.length > 0
                                            ? Math.floor(
                                                  calcAverageRatings(
                                                      ratings[0].ratings
                                                  ).average
                                              )
                                            : 0
                                    }
                                    icon={<Star color="primary" />}
                                    emptyIcon={<StarOutline color="primary" />}
                                    readOnly
                                />
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    (
                                    <Typography
                                        color="primary"
                                        component="span"
                                        variant="body1"
                                    >
                                        {(ratings.length > 0 &&
                                            calcAverageRatings(
                                                ratings[0].ratings
                                            ).average) ||
                                            0}
                                    </Typography>
                                    ) Ratings
                                </Typography>
                            </Stack>
                            <Typography variant="body1" color="text.secondary">
                                (
                                <Typography
                                    color="primary"
                                    component="span"
                                    variant="body1"
                                >
                                    {(ratings.length > 0 &&
                                        calcAverageRatings(ratings[0].ratings)
                                            .total) ||
                                        0}
                                </Typography>
                                ) Reviews
                            </Typography>
                        </Stack>
                        <Box sx={{ width: 'max-content' }}>
                            {product?.staff_picked && (
                                <Pill color="primary" text="STAFF PICKED" />
                            )}
                        </Box>
                    </Stack>
                    <Divider />
                    <Box>
                        <Table
                            sx={{
                                width: 'max-content',
                                '&  td': { border: 'none', padding: '8px' },
                            }}
                        >
                            <TableRow>
                                {product?.selling_price && (
                                    <TableCell
                                        sx={{ border: 'none' }}
                                        align="right"
                                    >
                                        <Typography color="text.secondary">
                                            List Price:
                                        </Typography>
                                    </TableCell>
                                )}
                                <TableCell align="left">
                                    <Typography
                                        color="text.secondary"
                                        sx={{ textDecoration: 'line-through' }}
                                    >
                                        &euro;
                                        {product?.price.toFixed(2)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: 'none' }}>
                                <TableCell align="right">
                                    <Typography color="text.secondary">
                                        Price:
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography fontWeight="bold" variant="h6">
                                        &euro;
                                        {(
                                            product?.selling_price ||
                                            product?.price
                                        )?.toFixed(2)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            {product?.selling_price && (
                                <TableRow sx={{ border: 'none' }}>
                                    <TableCell align="right">
                                        <Typography color="text.secondary">
                                            You Save:
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography color="text.secondary">
                                            &euro;
                                            {
                                                calcDiscount(
                                                    product.price,
                                                    product.selling_price
                                                ).discount_value
                                            }{' '}
                                            (
                                            {
                                                calcDiscount(
                                                    product.price,
                                                    product.selling_price
                                                ).discount_percent
                                            }
                                            % discount)
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </Table>
                    </Box>
                    <Divider />
                    <Stack gap="24px">
                        {variants?.map((variant) => (
                            <Stack gap="8px">
                                <Typography>
                                    {variant.name}: {variant.selectedTerm}
                                </Typography>
                                <Stack flexDirection="row" gap="8px">
                                    {variant.terms.map((term) =>
                                        variant.variant_type === 'color' ? (
                                            <Tooltip title={term.name}>
                                                <Radio
                                                    sx={{
                                                        '&, &.Mui-checked': {
                                                            color: term.name,
                                                        },
                                                    }}
                                                    onChange={() =>
                                                        variantSelector(
                                                            variant.name,
                                                            term.name
                                                        )
                                                    }
                                                    checked={
                                                        term.name ===
                                                        variant.selectedTerm
                                                    }
                                                />
                                            </Tooltip>
                                        ) : variant.variant_type === 'size' ? (
                                            <ButtonGroup>
                                                <Button
                                                    onClick={() =>
                                                        variantSelector(
                                                            variant.name,
                                                            term.name
                                                        )
                                                    }
                                                    sx={{
                                                        width: '2rem',
                                                        borderRadius: '0px',
                                                    }}
                                                    disableElevation
                                                    variant={
                                                        term.name ===
                                                        variant.selectedTerm
                                                            ? 'contained'
                                                            : 'outlined'
                                                    }
                                                >
                                                    {term.name}
                                                </Button>
                                            </ButtonGroup>
                                        ) : (
                                            <VariantImageButton
                                                style={{
                                                    border:
                                                        term.name ===
                                                        variant.selectedTerm
                                                            ? '2px solid black'
                                                            : 'none',
                                                }}
                                                onClick={() =>
                                                    variantSelector(
                                                        variant.name,
                                                        term.name
                                                    )
                                                }
                                            >
                                                {term.image?.url ? (
                                                    <img
                                                        src={term?.image?.url}
                                                        crossOrigin="anonymous"
                                                    />
                                                ) : (
                                                    <PhotoAlbumOutlined color="secondary" />
                                                )}
                                            </VariantImageButton>
                                        )
                                    )}
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                    <Divider />
                    <Stack flexDirection="row" gap="32px" alignItems="center">
                        {!user ? (
                            <Typography>
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    underline="always"
                                >
                                    Login
                                </Link>{' '}
                                to add items in cart.
                            </Typography>
                        ) : (
                            <Stack flexDirection="row" gap="8px">
                                <IconButton
                                    onClick={() =>
                                        setQuantity((state) =>
                                            state > 0 ? state - 1 : 0
                                        )
                                    }
                                >
                                    <Remove fontSize="small" />
                                </IconButton>
                                <TextField
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = e.target.value.replaceAll(
                                            /[^0-9]/g,
                                            ''
                                        )
                                        setQuantity(+val)
                                    }}
                                    sx={{ width: '4rem', textAlign: 'center' }}
                                    size="small"
                                />
                                <IconButton
                                    onClick={() =>
                                        setQuantity((state) => state + 1)
                                    }
                                >
                                    <AddOutlined fontSize="small" />
                                </IconButton>
                            </Stack>
                        )}
                        <Button
                            size="large"
                            variant="contained"
                            disableElevation
                            startIcon={!isLoading.add_item && <ShoppingCart />}
                            sx={{ padding: '16px 32px' }}
                            onClick={clickAddToCartHandler}
                            disabled={
                                isLoading.add_item ||
                                quantity <= 0 ||
                                quantity > (product?.stock || quantity + 1)
                            }
                        >
                            {isLoading.add_item ? (
                                <CircularProgress size={16} />
                            ) : quantity <= (product?.stock || quantity + 1) ? (
                                'Add to cart'
                            ) : (
                                'Not sufficient stock'
                            )}
                        </Button>
                    </Stack>
                </Details>
            </ProductInfo>
            <ProductDetails>
                <Typography variant="h3" fontWeight="300">
                    Product{' '}
                    <span
                        style={{
                            fontFamily: 'Playfair Display',
                            fontStyle: 'italic',
                        }}
                    >
                        Details
                    </span>
                </Typography>
                <Stack
                    flexDirection="row"
                    gap="80px"
                    justifyContent="space-between"
                    alignItems="baseline"
                >
                    <Stack gap="32px" flex={3}>
                        <Typography variant="h4">Description</Typography>
                        <Stack gap="8px">
                            {product?.description.split('\n').map((para, i) => (
                                <Typography key={i} color="GrayText">
                                    {para}
                                </Typography>
                            ))}
                        </Stack>
                    </Stack>
                    <Stack gap="32px" flex={2}>
                        <Typography variant="h4">Technical Details</Typography>
                        <Table
                            sx={{
                                border: `1px solid ${theme.palette.grey[600]}`,
                                maxWidth: '40rem',
                                '& tr': {
                                    display: 'flex',
                                },
                                '& tr :nth-child(1)': {
                                    background: theme.palette.grey[400],
                                },
                                '& td': {
                                    flex: 1,
                                    borderBottom: '0px',
                                },
                                '& tr:not(:last-child) td': {
                                    borderBottom: `1px solid ${theme.palette.grey[600]}`,
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>
                                    {product?.manufacturing_details?.brand}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>{product?.sku}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Model Number</TableCell>
                                <TableCell>
                                    {
                                        product?.manufacturing_details
                                            ?.model_number
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Dimensions</TableCell>
                                <TableCell>{`${product?.shipping?.dimensions?.width}cm x ${product?.shipping?.dimensions?.height}cm x ${product?.shipping?.dimensions?.length}cm (w x h x l)`}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Weight</TableCell>
                                <TableCell>
                                    {product?.shipping?.weight + 'kg'}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Manufactued Date</TableCell>
                                <TableCell>
                                    {new Date(
                                        product?.manufacturing_details
                                            ?.release_date as string
                                    ).toDateString()}
                                </TableCell>
                            </TableRow>
                        </Table>
                    </Stack>
                </Stack>
            </ProductDetails>
            <Divider sx={{ background: theme.palette.grey[400] }} />
            <ProductDetails>
                <Typography fontWeight="300" variant="h3">
                    Product{' '}
                    <span
                        style={{
                            fontFamily: 'Playfair Display',
                            fontStyle: 'italic',
                        }}
                    >
                        Reviews
                    </span>
                </Typography>
                <Stack flexDirection="row" gap="16px">
                    <Stack flex={1}>
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap="8px"
                        >
                            <Rating
                                value={
                                    ratings.length > 0
                                        ? Math.floor(
                                              calcAverageRatings(
                                                  ratings[0].ratings
                                              ).average
                                          )
                                        : 0
                                }
                                icon={<Star color="primary" />}
                                emptyIcon={<StarOutline color="primary" />}
                                readOnly
                            />
                            <Typography variant="h6" color="text.secondary">
                                (
                                <Typography
                                    color="primary"
                                    component="span"
                                    variant="inherit"
                                >
                                    {(ratings.length > 0 &&
                                        calcAverageRatings(ratings[0].ratings)
                                            .average) ||
                                        0}
                                </Typography>
                                ) Ratings
                            </Typography>
                        </Stack>
                        <Typography variant="h6" color="text.secondary">
                            (
                            <Typography
                                color="primary"
                                component="span"
                                variant="inherit"
                            >
                                {(ratings.length > 0 &&
                                    calcAverageRatings(ratings[0].ratings)
                                        .total) ||
                                    0}
                            </Typography>
                            ) Customers Reviews
                        </Typography>
                        <Table
                            sx={{
                                maxWidth: '28rem',
                                '& tr': {
                                    display: 'flex',
                                },

                                '& td:nth-child(2)': {
                                    flex: '0 0 60%',
                                },
                            }}
                        >
                            {[...new Array(5)].map((_, ind) => (
                                <TableRow>
                                    <TableCell>{5 - ind} star</TableCell>
                                    <TableCell>
                                        <Tooltip
                                            title={`${
                                                ratings
                                                    .find(
                                                        (rating) =>
                                                            rating.product ===
                                                            product?._id
                                                    )
                                                    ?.ratings.find(
                                                        (rating) =>
                                                            rating.rating_star ===
                                                            5 - ind
                                                    )?.ratings_count || 0
                                            } reviews`}
                                        >
                                            <LinearProgress
                                                sx={{
                                                    height: '1.4rem',
                                                }}
                                                value={calcRatingsPercentage(
                                                    5 - ind
                                                )}
                                                variant="determinate"
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        {calcRatingsPercentage(5 - ind)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                        {!userReview && (
                            <Stack marginTop="32px">
                                <Typography variant="h6">
                                    {!user
                                        ? 'Login now to write a review'
                                        : 'How was your experience?'}
                                </Typography>
                                {user && (
                                    <Typography fontWeight="300" variant="h6">
                                        Share your thought and experience with
                                        other people.
                                    </Typography>
                                )}
                                <Box sx={{ padding: '24px 0' }}>
                                    <Button
                                        size="large"
                                        disableElevation
                                        variant="contained"
                                        startIcon={user && <EditOutlined />}
                                        sx={{ padding: '16px 24px' }}
                                        onClick={() =>
                                            !user
                                                ? navigate('/login')
                                                : setShowModal(true)
                                        }
                                    >
                                        {!user ? 'Login Now' : 'Write a review'}
                                    </Button>
                                </Box>
                            </Stack>
                        )}
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
                                <Typography variant="h4">Add Review</Typography>
                                <AddReviewView
                                    isLoading={isLoadingReview.create}
                                    onSave={saveMyReviewHandler}
                                    onCancel={() => setShowModal(false)}
                                />
                            </ModalInnerContainer>
                        </Modal>
                    </Stack>
                    <Stack flex={2} gap="48px">
                        {userReview && (
                            <Stack maxWidth="800px" gap="32px">
                                <Typography variant="h5">
                                    Your Review
                                </Typography>
                                <Divider />

                                <Review
                                    isLoading={
                                        isLoadingReview.delete ||
                                        isLoadingReview.update
                                    }
                                    onSave={updateMyReviewHandler}
                                    onDelete={deleteMyReviewHandler}
                                    review={userReview}
                                />
                            </Stack>
                        )}
                        <Stack maxWidth="800px" gap="48px">
                            <Typography variant="h5">
                                Recent Reviews From Our Customer
                            </Typography>
                            <Divider />
                            {allReviews.map((review) => (
                                <Review readonly review={review} />
                            ))}
                        </Stack>
                        {count <= 0 ? (
                            <Typography>
                                There are no reviews to show
                            </Typography>
                        ) : (
                            allReviews.length < count && (
                                <Box>
                                    <Button
                                        onClick={() =>
                                            setPage((page) => page + 1)
                                        }
                                    >
                                        Load more reviews
                                    </Button>
                                </Box>
                            )
                        )}
                    </Stack>
                </Stack>
            </ProductDetails>
            <ProductCardList
                title="Frequently purchased with these items."
                subtitle="Bought Together"
                slides={itemsBoughtTogether.map((item) => ({
                    title: item.product.title,
                    prices: {
                        price: item.product.price,
                        sale_price: item.product.selling_price,
                    },
                    image: item?.image?.url,
                    isStaffPicked: item.product.staff_picked,
                    colors: item.product.variants
                        .find((variant) => variant.name === 'Color')
                        ?.terms.map((term) => term.name),
                }))}
            />
            <Footer />
        </ProductStyled>
    )
}

export default Product
