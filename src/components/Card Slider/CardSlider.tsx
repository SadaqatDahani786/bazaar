import { useState } from 'react'

import { ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material'

import styled from 'styled-components'
import { motion } from 'framer-motion'

//Components
import ProductCard from '../Product Card'
import { IProductCardProps } from '../Product Card/ProductCard'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */

//Card Slider
const CardSiderStyled = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
`

//Card Slider Inner
const CardSliderInner = styled(motion.div)<ISlide>`
    --gap-slides: 16px;
    --slide-width: calc((100% / ${({ $numSlidesToShow }) => $numSlidesToShow}));
    --slide-preview-width: calc(
        (
            (var(--slide-width) / 3) /
                ${({ $numSlidesToShow }) => $numSlidesToShow}
        )
    );
    --slide-width-with-preview: calc(
        var(--slide-width) - var(--slide-preview-width)
    );

    width: 100%;
    height: 100%;
    display: flex;
    gap: var(--gap-slides);
`

//Slide
const Slide = styled.div<ISlide>`
    --slide-width-to-apply: ${({ $showNextPreview }) =>
        $showNextPreview
            ? 'var(--slide-width-with-preview)'
            : 'var(--slide-width)'};

    flex: 0 0 calc(var(--slide-width-to-apply) - var(--gap-slides));
    height: 100%;

    ${(props) => props.theme.breakpoints.down('sm')} {
        flex: 0 0 calc(var(--slide-width-to-apply) + var(--gap-slides));
    }
`

//Slider Control
const SliderControl = styled(motion.a)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    padding: 8px;
    background: ${(props) => props.theme.palette.secondary.main};
    border-radius: 100%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
`

/**
 ** ======================================================
 ** Interface [ISlide]
 ** ======================================================
 */
interface ISlide {
    $numSlidesToShow?: number
    $showNextPreview?: boolean
}

/**
 ** ======================================================
 ** Interface [ICardSliderProps]
 ** ======================================================
 */
interface ICardSliderProps {
    size?: 'sm' | 'md' | 'lg'
    showNextPreview?: boolean
    slides: Array<IProductCardProps>
    slidesToShow?: number
}

/**
 ** ======================================================
 ** Component [CardSlider]
 ** ======================================================
 */
const CardSlider = ({
    size = 'md',
    slides,
    showNextPreview = true,
    slidesToShow = 3,
}: ICardSliderProps) => {
    /*
     ** **
     ** ** ** State
     ** **
     */
    const [currSlide, setCurrSlide] = useState(0)
    const [isMouseOverOnSlider, setIsMouseOverOnSlider] = useState(false)

    /*
     ** **
     ** ** ** Methods
     ** **
     */

    //Click Next Slide Handler
    const clickNextSlideHandler = () => {
        if (currSlide + 1 >= slides.length) return
        setCurrSlide((state) => state + 1)
    }

    //Click Prev Slide Handler
    const clickPrevSlideHandler = () => {
        if (currSlide <= 0) return
        setCurrSlide((state) => state - 1)
    }

    return (
        <CardSiderStyled
            onMouseEnter={() => setIsMouseOverOnSlider(true)}
            onMouseLeave={() => setIsMouseOverOnSlider(false)}
            style={{
                height:
                    size === 'sm' ? '300px' : size === 'lg' ? '100vh' : '660px',
            }}
        >
            <CardSliderInner
                $showNextPreview={showNextPreview}
                $numSlidesToShow={slidesToShow}
                initial={{
                    transform: `translateX(0%)`,
                }}
                animate={{
                    transform: `translateX(calc( (var(--${
                        showNextPreview
                            ? 'slide-width-with-preview'
                            : 'slide-width'
                    }) + ${
                        slidesToShow === 1 ? ' var(--gap-slides) * 2' : '0px'
                    }) * ${-currSlide}))`,
                }}
                transition={{
                    type: 'spring',
                    duration: 0.4,
                    mass: 0.4,
                    damping: 3,
                    velocity: 50,
                    stiffness: 7,
                }}
            >
                {slides.map((slide, ind) => (
                    <Slide key={ind} $showNextPreview={showNextPreview}>
                        <ProductCard {...slide} />
                    </Slide>
                ))}
            </CardSliderInner>

            <SliderControl
                animate={{
                    left:
                        isMouseOverOnSlider && currSlide > 0 ? '55px' : '-55px',
                }}
                onClick={clickPrevSlideHandler}
            >
                <ArrowBackOutlined fontSize="large" />
            </SliderControl>
            <SliderControl
                animate={{
                    right:
                        isMouseOverOnSlider && currSlide + 1 < slides.length
                            ? '55px'
                            : '-55px',
                }}
                onClick={clickNextSlideHandler}
            >
                <ArrowForwardOutlined fontSize="large" />
            </SliderControl>
        </CardSiderStyled>
    )
}

export default CardSlider
