import { useEffect, useState } from 'react'

import { Typography, useTheme } from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../store/store'
import {
    getProductsInCategoryAsync,
    getTrendingItemsInYourAreaAsync,
    getUserInterestsItemsAsync,
    IProduct,
} from '../../store/productReducer'
import { getManyCategoryAsync, ICategory } from '../../store/categoryReducer'

//Components
import Header from '../../layouts/Header'
import Carousel from '../../components/Carousel'
import ProductCardList from '../../components/Product Card List'
import Grid from '../../components/Grid'
import Footer from '../../layouts/Footer'
import CardSlider from '../../components/Card Slider'

//Hooks
import useWindowDimensions from '../../hooks/useWindowDimensions'

//Assets
import SaleImage from '../../assets/images/sale.avif'
import MensFashionImage from '../../assets/images/mens-fashion.avif'
import GamingImage from '../../assets/images/gaming.avif'
import BoysFashionImage from '../../assets/images/boys-fashion.avif'
import GirlsFashionImage from '../../assets/images/girls-fashion.avif'
import HealthAndBeautyImage from '../../assets/images/health-and-beauty.avif'
import SkinCareImage from '../../assets/images/skincare.avif'
import FragrancesImage from '../../assets/images/fragrances.avif'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Home Styled
const HomeStyled = styled.div``

//Section
const Section = styled.section`
    width: 100%;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-top: 1px solid ${(props) => props.theme.palette.grey['300']};
    padding: 160px 48px;

    ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 80px 16px;
    }

    &:nth-of-type(3) {
        padding-left: 0;
        padding-right: 0;

        ${(props) => props.theme.breakpoints.down('sm')} {
            padding-left: 16px;
            padding-right: 16px;
        }
    }

    &:nth-of-type(7) {
        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        padding: 0;
        height: 100vh;
    }
`

//Wrapper
const Wrapper = styled.div`
    width: 100%;
    height: 120%;
`
//Heading
const Heading = styled(Typography)`
    padding-bottom: 160px;
    font-family: 'Playfair Display';

    ${(props) => props.theme.breakpoints.down('sm')} {
        padding-bottom: 80px;
    }

    & span {
        font-weight: bold;
        font-style: italic;
    }
`

//Details
const Details = styled.div`
    position: absolute;
    top: 40%;
    right: 48px;
    max-width: 580px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 24px;

    ${(props) => props.theme.breakpoints.down('sm')} {
        left: 0;
        width: 100%;
        padding: 0 8px;
    }
`

/**
 ** ======================================================
 ** Component [Home]
 ** ======================================================
 */
const Home = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const user = useAppSelector((state) => state.auth.data)
    const dispatch = useAppDispatch()

    //State
    const [numSlidesHistory, setNumSlidesHistory] = useState(6)
    const [numSlidesStaffPicked, setNumSlidesStaffPicked] = useState(3)

    //Products
    const [fashionProducts, setFashionProducts] = useState<IProduct[]>()

    const [fashionStaffpickedProducts, setFashionStaffpickedProducts] =
        useState<IProduct[]>()

    const [trendingItemsInYourArea, setTrendingItemsInYourArea] =
        useState<IProduct[]>()

    const [userInterestsItems, setUserInterestsItems] = useState<IProduct[]>([])

    //Categories
    const [categories, setCategories] = useState<ICategory[]>([])

    //Theme
    const theme = useTheme()
    const windowDimensions = useWindowDimensions()

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Set no of slides to show on window resize
    useEffect(() => {
        //History
        if (windowDimensions.width >= theme.breakpoints.values.lg) {
            setNumSlidesHistory(6)
        } else if (windowDimensions.width >= theme.breakpoints.values.md) {
            setNumSlidesHistory(4)
        } else if (windowDimensions.width >= theme.breakpoints.values.sm) {
            setNumSlidesHistory(2)
        } else if (windowDimensions.width >= theme.breakpoints.values.xs) {
            setNumSlidesHistory(1)
        }

        //Staff picked
        if (windowDimensions.width >= theme.breakpoints.values.lg) {
            setNumSlidesStaffPicked(3)
        } else if (windowDimensions.width >= theme.breakpoints.values.md) {
            setNumSlidesStaffPicked(2)
        } else if (windowDimensions.width >= theme.breakpoints.values.xs) {
            setNumSlidesStaffPicked(1)
        }
    }, [windowDimensions])

    //Scroll to top
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    //Fetch products
    useEffect(() => {
        //1) Fetch fashion products
        dispatch(
            getProductsInCategoryAsync({
                category_slug: 'fashion',
                queryParams: [],
                cb: (products) => setFashionProducts(products),
            })
        )

        //2) Fetch staff picked fashion products
        dispatch(
            getProductsInCategoryAsync({
                category_slug: 'fashion',
                queryParams: [{ key: 'staff_picked', value: 'true' }],
                cb: (products) => setFashionStaffpickedProducts(products),
            })
        )

        //3) Fetch trending items in your are
        dispatch(
            getTrendingItemsInYourAreaAsync((products) =>
                setTrendingItemsInYourArea(products)
            )
        )

        //4) Fetch trending items in your are
        dispatch(
            getUserInterestsItemsAsync((products) =>
                setUserInterestsItems(products)
            )
        )

        //4) Fetch categories
        dispatch(
            getManyCategoryAsync({
                queryParams: [{ key: 'limit', value: '200' }],
                cb: (categories) => setCategories(categories),
            })
        )
    }, [])

    return (
        <HomeStyled>
            <Header />
            <Carousel
                slides={[
                    [
                        {
                            title: '**Dress like** a gentlemen **with our apparels for men.**',
                            subtitle: "Men's Fashion",
                            image: MensFashionImage,
                            url: 'products/mens-fashion/1',
                        },
                    ],
                    [
                        {
                            title: '**Unleash** your gaming **and dominate.**',
                            subtitle: 'Gaming',
                            image: GamingImage,
                            url: 'products/gaming/1',
                        },
                    ],
                    [
                        {
                            title: '**Let boy** grow into a man **with our fine products.**',
                            subtitle: "Boys' Fashion",
                            image: BoysFashionImage,
                            url: 'products/boys-fashion/1',
                        },
                        {
                            title: '**Cute fashionable** clothes **for your princess.**',
                            subtitle: "Girls' Fashion",
                            image: GirlsFashionImage,
                            url: 'products/girls-fashion/1',
                        },
                    ],
                    [
                        {
                            title: '**Glitter like** moonshine and glow **with our organic beauty products.**',
                            subtitle: 'Health & Beauty',
                            image: HealthAndBeautyImage,
                            url: 'products/health-and-beauty/1',
                        },
                        {
                            title: 'Skin Care',
                            image: SkinCareImage,
                            url: 'products/skin-care/1',
                        },
                        {
                            title: 'Fragrances',
                            image: FragrancesImage,
                            url: 'products/fragrances/1',
                        },
                    ],
                ]}
            />
            <ProductCardList
                title="Discover the latest fashion trends made for you."
                subtitle="Latest"
                url="/products/fashion/1"
                helpertext='No products found in "fashion" category.'
                slides={
                    fashionProducts?.map((prod) => ({
                        title: prod.title,
                        prices: {
                            price: prod.price,
                            sale_price: prod.selling_price,
                        },
                        image: prod.image?.url,
                        isStaffPicked: prod.staff_picked,
                        colors: prod.variants
                            ?.find(
                                (variant) => variant.variant_type === 'color'
                            )
                            ?.terms.map((term) => term.name),
                        url: `/product/${prod._id}`,
                    })) || []
                }
            />
            <Section>
                <Heading variant="h2">Shop By Category</Heading>
                {categories.length <= 0 ? (
                    <Typography variant="h5">
                        There are no categories to be found, please add few to
                        see them right here.
                    </Typography>
                ) : (
                    <Grid
                        items={categories
                            .filter((cat) => !cat.parent)
                            .map((cat) => ({
                                name: cat.name,
                                slug: cat.slug,
                                image: cat.image?.url,
                            }))}
                    />
                )}
            </Section>
            <Section>
                <Heading variant="h2">
                    Staff Picked{' '}
                    <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                        Fashion
                    </span>
                </Heading>
                <Wrapper>
                    <CardSlider
                        size="lg"
                        showNextPreview={false}
                        slidesToShow={numSlidesStaffPicked}
                        helpertext={
                            'No staff picked products found in "fashion" category.'
                        }
                        slides={
                            fashionStaffpickedProducts?.map((prod) => ({
                                title: prod.title,
                                prices: {
                                    price: prod.price,
                                    sale_price: prod.selling_price,
                                },
                                image: prod.image?.url,
                                isStaffPicked: prod.staff_picked,
                                colors: prod.variants
                                    ?.find(
                                        (variant) =>
                                            variant.variant_type === 'color'
                                    )
                                    ?.terms.map((term) => term.name),
                                url: `/product/${prod._id}`,
                            })) || []
                        }
                    />
                </Wrapper>
            </Section>
            <ProductCardList
                title={`Discover what's trending in ${
                    user?.addresses.find((addr) => addr.default_billing_address)
                        ?.country || 'your area'
                }.`}
                subtitle="Trending"
                helpertext={`No trending items found in your location.`}
                slides={
                    trendingItemsInYourArea?.map((prod) => ({
                        title: prod.title,
                        prices: {
                            price: prod.price,
                            sale_price: prod.selling_price,
                        },
                        image: prod.image?.url,
                        isStaffPicked: prod.staff_picked,
                        colors: prod.variants
                            ?.find(
                                (variant) => variant.variant_type === 'color'
                            )
                            ?.terms.map((term) => term.name),
                        url: `/product/${prod._id}`,
                    })) || []
                }
            />
            <ProductCardList
                title="Take a look what we've found for you."
                subtitle="Just For You"
                helpertext="Explore the site so we can give you some recommendations based on your interests."
                slides={
                    userInterestsItems?.map((prod) => ({
                        title: prod.title,
                        prices: {
                            price: prod.price,
                            sale_price: prod.selling_price,
                        },
                        image: prod.image?.url,
                        isStaffPicked: prod.staff_picked,
                        colors: prod.variants
                            ?.find(
                                (variant) => variant.variant_type === 'color'
                            )
                            ?.terms.map((term) => term.name),
                        url: `/product/${prod._id}`,
                    })) || []
                }
            />
            <Section>
                <Heading variant="h2">
                    Your Browsing <span>History</span>
                </Heading>
                <Wrapper>
                    {!user ? (
                        <Typography variant="h6">
                            Login to see your browsing history here.
                        </Typography>
                    ) : (
                        <CardSlider
                            showNextPreview={false}
                            slidesToShow={numSlidesHistory}
                            size="sm"
                            helpertext={
                                'When you visit product details page, it will be saved in your watch history and will be shown here.'
                            }
                            slides={
                                Array.from(user?.history || [])
                                    ?.sort((a, b) =>
                                        a.touch_date < b.touch_date
                                            ? 1
                                            : a.touch_date > b.touch_date
                                            ? -1
                                            : 0
                                    )
                                    .map(({ product }) => ({
                                        image: product?.image?.url,
                                        url: `product/${product._id}`,
                                    })) || []
                            }
                        />
                    )}
                </Wrapper>
            </Section>
            <Section>
                <img src={SaleImage} />
                <Details>
                    <Typography
                        color="secondary"
                        fontFamily="Playfair Display"
                        fontWeight="bold"
                        variant="h2"
                    >
                        Hurry up!
                    </Typography>
                    <Typography color="secondary" variant="h5">
                        Save huge with big discount on ongoing sale on variety
                        of products.
                    </Typography>
                    {/* <Wrapper>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            style={{
                                padding: '1.5rem 2rem',
                                borderRadius: '0px',
                            }}
                        >
                            <Typography variant="h5">See Deals</Typography>
                        </Button>
                    </Wrapper> */}
                </Details>
            </Section>
            <Footer />
        </HomeStyled>
    )
}

export default Home
