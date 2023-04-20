import { useState } from 'react'

import { ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material'

import styled from 'styled-components'
import { motion } from 'framer-motion'

//Components
import CarouselSlide from './CarouselSlide'

/**
 ** **
 ** ** Syled Components
 ** **
 */
//Carousel
const CarouselStyled = styled.div`
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
`

//Overlay
const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.palette.primary.light};
    z-index: 10 !important;
`

//Carousel Inner
const CarouselInner = styled(motion.div)<ICarouselInner>`
    width: 100%;
    height: 100%;
    display: flex;
`

//Slide
const Slide = styled.div`
    flex: 0 0 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    gap: 16px;
    position: relative;

    ${(props) => props.theme.breakpoints.down('md')} {
        flex-direction: column;
    }

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const SlideLeft = styled.div`
    flex: 2;
    position: relative;
    overflow: hidden;

    ${(props) => props.theme.breakpoints.down('md')} {
        flex: 1;
    }
`

const SlideRight = styled.div`
    flex: 1;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const SliderRow = styled.div`
    height: calc(50% - 8px);
    position: relative;

    ${(props) => props.theme.breakpoints.down('md')} {
        height: 100%;

        &:nth-child(2) {
            display: none;
        }
    }
`

//Carousel Control
const CarouselControl = styled(motion.a)`
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
 ** Interface [ICarouselProps]
 ** ======================================================
 */
interface ICarouselProps {
    slides: Array<
        Array<{
            title: string
            subtitle?: string
            image: string
        }>
    >
}

/**
 ** ======================================================
 ** Interface [ICarouselInner]
 ** ======================================================
 */
interface ICarouselInner {
    numSlides: number
    currSlide: number
}

/**
 ** ======================================================
 ** Component [Carousel]
 ** ======================================================
 */
const Carousel = ({
    /*
     ** **
     ** ** ** Dummy Data
     ** **
     */
    slides = [],
}: ICarouselProps) => {
    /*
     ** **
     ** ** ** State
     ** **
     */
    const [currSlide, setCurrSlide] = useState(0)
    const [isMouseOverOnSlider, setIsMouseOverOnSlider] = useState(false)

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
        <CarouselStyled
            onMouseEnter={() => setIsMouseOverOnSlider(true)}
            onMouseLeave={() => setIsMouseOverOnSlider(false)}
        >
            <CarouselInner
                initial={{
                    transform: `translateX(0%)`,
                }}
                animate={{
                    transform: `translateX(calc(${currSlide} * -100%))`,
                }}
                transition={{
                    type: 'spring',
                    duration: 0.4,
                    mass: 0.4,
                    damping: 3,
                    velocity: 50,
                    stiffness: 7,
                }}
                currSlide={currSlide}
                numSlides={slides.length}
            >
                {slides.map((slide) =>
                    Array.isArray(slide) && slide.length === 3 ? (
                        <Slide>
                            <Overlay />
                            <SlideLeft>
                                <CarouselSlide
                                    title={slide[0].title}
                                    subtitle={slide[0].subtitle}
                                    image={slide[0].image}
                                    variant="mini"
                                />
                            </SlideLeft>
                            <SlideRight>
                                <SliderRow>
                                    <CarouselSlide
                                        title={slide[1].title}
                                        image={slide[1].image}
                                        variant="small"
                                    />
                                </SliderRow>
                                <SliderRow>
                                    <CarouselSlide
                                        title={slide[2].title}
                                        image={slide[2].image}
                                        variant="small"
                                    />
                                </SliderRow>
                            </SlideRight>
                        </Slide>
                    ) : Array.isArray(slide) && slide.length === 2 ? (
                        <Slide>
                            <Overlay />
                            <SlideLeft style={{ flex: 1 }}>
                                <CarouselSlide
                                    title={slide[0].title}
                                    subtitle={slide[0].subtitle}
                                    image={slide[0].image}
                                    variant="mini"
                                />
                            </SlideLeft>
                            <SlideRight>
                                <CarouselSlide
                                    title={slide[1].title}
                                    subtitle={slide[1].subtitle}
                                    image={slide[1].image}
                                    variant="mini"
                                />
                            </SlideRight>
                        </Slide>
                    ) : Array.isArray(slide) && slide.length === 1 ? (
                        <Slide>
                            <Overlay />
                            <SlideLeft>
                                <CarouselSlide
                                    title={slide[0].title}
                                    subtitle={slide[0].subtitle}
                                    image={slide[0].image}
                                    variant="full"
                                />
                            </SlideLeft>
                        </Slide>
                    ) : (
                        ''
                    )
                )}
            </CarouselInner>
            <CarouselControl
                animate={{
                    left:
                        isMouseOverOnSlider && currSlide > 0 ? '55px' : '-55px',
                }}
                className="control--left"
                onClick={clickPrevSlideHandler}
            >
                <ArrowBackOutlined fontSize="large" />
            </CarouselControl>
            <CarouselControl
                animate={{
                    right:
                        isMouseOverOnSlider && currSlide + 1 < slides.length
                            ? '55px'
                            : '-55px',
                }}
                className="control--right"
                onClick={clickNextSlideHandler}
            >
                <ArrowForwardOutlined fontSize="large" />
            </CarouselControl>
        </CarouselStyled>
    )
}

export default Carousel
