import { useEffect, useRef, useState } from 'react'

import {
    EuroOutlined,
    HomeOutlined,
    KeyboardArrowLeftOutlined,
    TuneOutlined,
} from '@mui/icons-material'
import {
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Drawer,
    FormControlLabel,
    Grid,
    Link,
    MenuItem,
    Pagination,
    Skeleton,
    Stack,
    Checkbox,
    TextField,
    Typography,
    useTheme,
    Radio,
    Tooltip,
    InputAdornment,
} from '@mui/material'

import styled from 'styled-components'
import {
    useNavigate,
    useParams,
    Link as RouterLink,
    useLocation,
} from 'react-router-dom'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import { getManyCategoryAsync, ICategory } from '../../store/categoryReducer'
import {
    getBrandsAsync,
    getColorsAsync,
    getProductsInCategoryAsync,
    getSizesAsync,
} from '../../store/productReducer'

//Components
import ProductCard from '../../components/Product Card'
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

//Hooks & Func
import useInput from '../../hooks/useInput'
import { combineValidators, IsDecimal } from '../../utils/validators'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Product In Category
const ProductsInCategoryStyled = styled.div`
    width: 100%;
`

//Hero
const Hero = styled.div`
    width: 100%;
    height: calc(100vh - 152px);
    background: ${(props) => props.theme.palette.grey['300']};
    overflow: hidden;
    position: relative;

    & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

//Hero Heading
const HeroHeading = styled.div`
    position: absolute;
    max-width: 480px;
    left: 64px;
    bottom: 10%;
    z-index: 10;
    height: 80%;
    padding: 0 24px;
    border-left: 1px solid ${(props) => props.theme.palette.grey['600']};
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: left;
`

//Overlay
const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000068;
`

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
`

//Drawer Inner Container
const DrawerInnerContainer = styled.div`
    width: 380px;
    height: 100%;
    overflow: scroll;
    padding: 48px 32px;
    display: flex;
    flex-direction: column;
    gap: 48px;
    background: ${(props) => props.theme.palette.grey['300']};
`

//List
const List = styled.ul`
    list-style: none;
    font-family: 'Lato';
    & ul {
        padding-left: 32px;
    }
`

//List Item
const ListItem = styled.li`
    display: flex;
    gap: 4px;
    align-items: center;
`

/**
 ** ======================================================
 ** Component [ProductsInCategory]
 ** ======================================================
 */
const ProductsInCategory = () => {
    /**
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const {
        data: products,
        count,
        isLoading,
    } = useAppSelector((state) => state.product)
    const categories = useAppSelector((state) => state.category.data)
    const dispatch = useAppDispatch()

    //Filters
    const [category, setCategory] = useState<ICategory>()
    const [brands, setBrands] = useState<{ brand: string; count: number }[]>([])
    const [colors, setColors] = useState<{ color: string }[]>([])
    const [sizes, setSizes] = useState<{ size: string }[]>([])
    const [priceMin, setPriceMin] = useState<number | undefined>()
    const [priceMax, setPriceMax] = useState<number | undefined>()
    const [isFilteredDrawerOpen, setIsFilteredDrawerOpen] = useState(false)
    const [filters, setFilers] = useState<
        { name: 'color' | 'size' | 'brand'; value: string }[]
    >([])

    //Hooks
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const theme = useTheme()

    //State
    const [page, setPage] = useState<number>(params.page ? +params.page : 1)
    const [sortby, setSortby] = useState('-created_at')

    const itemsPerPage = 9

    //Refs
    const refPriceMin = useRef<HTMLInputElement>(null)
    const refPriceMax = useRef<HTMLInputElement>(null)

    /**
     ** **
     ** ** ** Form Fields
     ** **
     */
    const inputPriceMin = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: IsDecimal,
                message: 'Please provide a valid price.',
            },
        ]),
    })
    const inputPriceMax = useInput({
        default_value: '',
        validation: combineValidators([
            {
                validator: IsDecimal,
                message: 'Please provide a valid price.',
            },
        ]),
    })

    /**
     ** **
     ** ** ** Side effects
     ** **
     */
    //Set initial setup
    useEffect(() => {
        //1) Scroll to top
        window.scrollTo({ top: 0, behavior: 'auto' })

        //2) Fetch prodcuts in category
        dispatch(getManyCategoryAsync([]))

        //3) Fetch brands
        dispatch(getBrandsAsync((res) => setBrands(res)))

        //4) Fetch colors
        dispatch(getColorsAsync((res) => setColors(res)))

        //5) Fetch sizes
        dispatch(getSizesAsync((res) => setSizes(res)))
    }, [])

    //Navigate to url of page, when page change
    useEffect(() => {
        if (page === (params?.page ? +params.page : 1)) return
        navigate(`/products/${params.category}/${page}`)
    }, [page])

    //Fetch/Refetch products in category
    useEffect(() => {
        //1) Get category from params
        const category = params.category

        //2) Validate
        if (!category) return

        //3) Dispatch action to fetch products in category
        dispatch(
            getProductsInCategoryAsync({
                category_slug: category,
                queryParams: [
                    { key: 'limit', value: itemsPerPage.toString() },
                    { key: 'page', value: page.toString() },
                    { key: 'sort', value: sortby },
                    ...filters
                        .filter((filter) => filter.name === 'brand')
                        .map((filter) => ({
                            key: 'manufacturing_details.brand',
                            value: filter.value,
                        })),
                    ...filters
                        .filter((filter) => filter.name === 'color')
                        .map((filter) => ({
                            key: 'variants.terms.name',
                            value: filter.value,
                        })),
                    ...filters
                        .filter((filter) => filter.name === 'size')
                        .map((filter) => ({
                            key: 'variants.terms.name',
                            value: filter.value,
                        })),
                    priceMin
                        ? {
                              ...{
                                  key: 'price[gte]',
                                  value: priceMin.toString(),
                              },
                              ...{
                                  key: 'selling_price[gte]',
                                  value: priceMin.toString(),
                              },
                          }
                        : { key: '', value: '' },
                    priceMax
                        ? {
                              ...{
                                  key: 'price[lte]',
                                  value: priceMax.toString(),
                              },
                              ...{
                                  key: 'selling_price[lte]',
                                  value: priceMax.toString(),
                              },
                          }
                        : { key: '', value: '' },
                ],
            })
        )
    }, [sortby, filters, priceMin, priceMax, location.pathname])

    //Fetch category from the slug provided in url
    useEffect(() => {
        //1) Validate
        if (!categories || categories.length <= 0) return

        //2) Find category
        const cat = categories.find((cat) => cat.slug === params.category)

        //3) Set category
        if (cat) setCategory(cat)
    }, [categories, location.pathname])

    //Close filter side drawer when navigation happens
    useEffect(() => {
        setIsFilteredDrawerOpen(false)
    }, [location.pathname])

    /**
     ** **
     ** ** ** Methods
     ** **
     */
    //Category List Maker
    const categoryListMaker = (selectedCategory: ICategory | undefined) => {
        //1) Validate
        if (!selectedCategory) return

        //2) Find a parent, itself and childrens of current category in categories
        const cats = categories.reduce<{
            parent: ICategory | null
            self: ICategory | null
            children: ICategory[]
        }>(
            (acc, cat) => {
                if (selectedCategory?.parent?.slug === cat.slug)
                    acc.parent = cat
                else if (cat.slug === selectedCategory?.slug) acc.self = cat
                else if (selectedCategory.slug === cat.parent?.slug)
                    acc.children.push(cat)
                return acc
            },
            { parent: null, self: null, children: [] }
        )

        //3) Return list of categories
        return cats.parent ? (
            <List>
                <ListItem>
                    <KeyboardArrowLeftOutlined />
                    <Link
                        underline="hover"
                        component={RouterLink}
                        to={`/products/${cats.parent?.slug}/1`}
                    >
                        <Typography variant="body2">
                            {cats.parent?.name}
                        </Typography>
                    </Link>
                </ListItem>
                <List>
                    <ListItem>
                        <Typography fontWeight="bold" variant="body1">
                            {cats.self?.name}
                        </Typography>
                    </ListItem>
                    <List>
                        {cats.children.map((child) => (
                            <ListItem>
                                <Link
                                    underline="hover"
                                    component={RouterLink}
                                    to={`/products/${child.slug}/1`}
                                >
                                    <Typography variant="body2">
                                        {child.name}
                                    </Typography>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </List>
            </List>
        ) : (
            <List>
                <ListItem>
                    <Typography fontWeight="bold" variant="body1">
                        {cats.self?.name}
                    </Typography>
                </ListItem>
                <List>
                    {cats.children.map((child) => (
                        <ListItem>
                            <Link
                                underline="hover"
                                component={RouterLink}
                                to={`/products/${child.slug}/1`}
                            >
                                <Typography variant="body2">
                                    {child.name}
                                </Typography>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </List>
        )
    }

    //Add or remove filters for color, brands & sizes
    const addRemoveFilters = (
        type: 'color' | 'size' | 'brand',
        value: string
    ) => {
        //1) Make a copy
        const updFilters = [...filters]

        //2) Check for already existence
        const ind = updFilters.findIndex(
            (filter) => filter.name === type && filter.value === value
        )

        //3) If exists, remove, else push new
        if (ind !== -1) updFilters.splice(ind, 1)
        else
            updFilters.push({
                name: type,
                value: value,
            })

        //4) Update
        setFilers(updFilters)
        setPage(1)
    }

    return (
        <ProductsInCategoryStyled>
            <Header />
            <Hero>
                <Overlay />
                {category && (
                    <>
                        <img
                            src={category.image?.url}
                            alt={category.image?.title}
                            crossOrigin="anonymous"
                        />
                        <HeroHeading>
                            <Stack gap="32px">
                                <Typography
                                    fontFamily="Playfair Display"
                                    fontStyle="italic"
                                    color="secondary"
                                    variant="h2"
                                >
                                    {category.name}
                                </Typography>
                                <Divider
                                    sx={{
                                        backgroundColor:
                                            theme.palette.grey['600'],
                                    }}
                                />
                                <Typography
                                    fontWeight="bold"
                                    color="secondary"
                                    variant="h5"
                                >
                                    {category.description}
                                </Typography>
                            </Stack>
                        </HeroHeading>
                    </>
                )}
            </Hero>
            <Toolbar>
                <Breadcrumbs color="text.secondary">
                    <Link
                        color="inherit"
                        underline="hover"
                        onClick={() => navigate('/')}
                    >
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap="4px"
                        >
                            <HomeOutlined /> Home
                        </Stack>
                    </Link>
                    <Typography color="primary">{category?.name}</Typography>
                </Breadcrumbs>
            </Toolbar>
            <Toolbar style={{ borderTop: 'none' }}>
                <Button
                    onClick={() => setIsFilteredDrawerOpen(true)}
                    startIcon={<TuneOutlined />}
                >
                    Filters
                </Button>
                <TextField
                    size="small"
                    sx={{ width: '10rem' }}
                    select
                    value={sortby}
                    onChange={(e) => setSortby(e.target.value)}
                >
                    <MenuItem value="-created_at">Latest</MenuItem>
                    <MenuItem value="created_at">Oldest</MenuItem>
                    <MenuItem value="-selling_price, -price">
                        Price: High to low
                    </MenuItem>
                    <MenuItem value="selling_price, price">
                        Price: Low to high
                    </MenuItem>
                </TextField>
            </Toolbar>
            <Grid
                minHeight="100vh"
                container
                sx={{ padding: '80px 48px' }}
                spacing={3}
            >
                {isLoading.fetch ? (
                    [...new Array(itemsPerPage)].map(() => (
                        <Grid item lg={4}>
                            <Skeleton
                                sx={{ height: '50rem' }}
                                variant="rectangular"
                                animation="wave"
                            />

                            <Typography component="div" variant="h3">
                                <Skeleton variant="text" animation="wave" />
                            </Typography>
                            <Typography component="div" variant="caption">
                                <Skeleton variant="text" animation="wave" />
                            </Typography>
                            <Typography component="div" variant="caption">
                                <Skeleton variant="text" animation="wave" />
                            </Typography>
                            <Typography component="div" variant="caption">
                                <Skeleton variant="text" animation="wave" />
                            </Typography>
                        </Grid>
                    ))
                ) : products.length <= 0 ? (
                    <Typography sx={{ margin: 'auto' }} variant="h2">
                        Uh oh! No products found.
                    </Typography>
                ) : (
                    products.map((product) => (
                        <Grid item lg={4}>
                            <Box
                                sx={{
                                    height: '56rem',
                                }}
                            >
                                <ProductCard
                                    title={product.title}
                                    prices={{
                                        price: product.price,
                                        sale_price: product.selling_price,
                                    }}
                                    colors={
                                        product.variants
                                            .find(
                                                (variant) =>
                                                    variant.variant_type ===
                                                    'color'
                                            )
                                            ?.terms.map((term) => term.name) ||
                                        []
                                    }
                                    isStaffPicked={product.staff_picked}
                                    image={product.image?.url}
                                    url={`/product/${product._id}`}
                                />
                            </Box>
                        </Grid>
                    ))
                )}
            </Grid>
            <Toolbar style={{ justifyContent: 'center' }}>
                <Pagination
                    page={page}
                    count={Math.ceil(count / itemsPerPage)}
                    variant="text"
                    color="primary"
                    shape="rounded"
                    size="large"
                    onChange={(e, page) => setPage(page)}
                />
            </Toolbar>
            <Footer />
            <Drawer
                open={isFilteredDrawerOpen}
                onClose={() => setIsFilteredDrawerOpen(false)}
            >
                <DrawerInnerContainer>
                    <Typography variant="h4">Filters: </Typography>
                    <Divider />
                    <Stack gap="16px">
                        <Typography
                            variant="h6"
                            fontWeight="300"
                            textTransform="uppercase"
                        >
                            Categories
                        </Typography>
                        {categoryListMaker(category)}
                    </Stack>
                    <Divider />
                    <Stack gap="16px">
                        <Typography
                            variant="h6"
                            fontWeight="300"
                            textTransform="uppercase"
                        >
                            Brands
                        </Typography>
                        <Stack>
                            {brands.map((brand) => (
                                <FormControlLabel
                                    key={brand.brand}
                                    label={brand.brand}
                                    onChange={() =>
                                        addRemoveFilters('brand', brand.brand)
                                    }
                                    control={
                                        <Checkbox
                                            sx={{ padding: '0 8px' }}
                                            size="small"
                                        />
                                    }
                                />
                            ))}
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack gap="16px">
                        <Typography
                            variant="h6"
                            fontWeight="300"
                            textTransform="uppercase"
                        >
                            Colors
                        </Typography>
                        <Stack flexDirection="row" flexWrap="wrap">
                            {colors.map((color) => (
                                <Tooltip title={color.color}>
                                    <Radio
                                        checked={filters.some(
                                            (filter) =>
                                                filter.name === 'color' &&
                                                filter.value === color.color
                                        )}
                                        size="small"
                                        onClick={() =>
                                            addRemoveFilters(
                                                'color',
                                                color.color
                                            )
                                        }
                                        sx={{
                                            '&, &.Mui-checked': {
                                                color: color,
                                            },
                                        }}
                                    />
                                </Tooltip>
                            ))}
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack gap="16px">
                        <Typography
                            variant="h6"
                            fontWeight="300"
                            textTransform="uppercase"
                        >
                            Sizes
                        </Typography>
                        <Stack>
                            {sizes.map((size) => (
                                <FormControlLabel
                                    label={size.size}
                                    control={
                                        <Checkbox
                                            size="small"
                                            sx={{ padding: '0 8px' }}
                                            onChange={() =>
                                                addRemoveFilters(
                                                    'size',
                                                    size.size
                                                )
                                            }
                                        />
                                    }
                                />
                            ))}
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack gap="16px">
                        <Typography
                            variant="h6"
                            fontWeight="300"
                            textTransform="uppercase"
                        >
                            Price Range
                        </Typography>
                        <Stack flexDirection="row">
                            <TextField
                                label="Min"
                                value={inputPriceMin.value}
                                onChange={inputPriceMin.onChangeHandler}
                                onBlur={inputPriceMin.onBlurHandler}
                                error={inputPriceMin.validation.error}
                                helperText={inputPriceMin.validation.message}
                                inputRef={refPriceMin}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EuroOutlined fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Max"
                                value={inputPriceMax.value}
                                onChange={inputPriceMax.onChangeHandler}
                                onBlur={inputPriceMax.onBlurHandler}
                                error={inputPriceMax.validation.error}
                                helperText={inputPriceMax.validation.message}
                                inputRef={refPriceMax}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EuroOutlined fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                onClick={() => {
                                    //1) Trigger validation
                                    inputPriceMin.validation.validate()
                                    inputPriceMax.validation.validate()

                                    //2) Focus on invalide fields
                                    if (inputPriceMin.validation.error)
                                        return refPriceMin.current?.focus()
                                    else if (inputPriceMax.validation.error)
                                        return refPriceMax.current?.focus()

                                    //3) No errors, proceed
                                    setPriceMin(+inputPriceMin.value)
                                    setPriceMax(+inputPriceMax.value)
                                }}
                                variant="contained"
                                disableElevation={true}
                            >
                                Go
                            </Button>
                        </Stack>
                    </Stack>
                </DrawerInnerContainer>
            </Drawer>
        </ProductsInCategoryStyled>
    )
}

export default ProductsInCategory
