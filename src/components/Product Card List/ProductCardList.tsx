import { ArrowForwardOutlined } from '@mui/icons-material'
import { Button, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

import styled from 'styled-components'
import useWindowDimensions from '../../hooks/useWindowDimensions'

//Components
import CardSlider from '../Card Slider'
import { IProductCardProps } from '../Product Card/ProductCard'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */

//Product Card List Styled
const ProductCardListStyled = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    min-height: 100vh;
    border-top: 1px solid ${(props) => props.theme.palette.grey['300']};
    padding: 160px 48px;

    ${(props) => props.theme.breakpoints.down('md')} {
        flex-direction: column;
        padding: 48px;
        gap: 32px;
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 80px 16px;
    }
`

//Column
const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    text-align: left;

    &:nth-child(1) {
        ${(props) => props.theme.breakpoints.down('md')} {
            width: 100%;
        }
    }

    &:nth-child(2) {
        width: 70%;
        ${(props) => props.theme.breakpoints.down('md')} {
            width: 100%;
        }
    }
`

//Wrapper
const Wrapper = styled.div`
    max-width: 560px;
`

/**
 ** ======================================================
 ** Interface [IProductCardList]
 ** ======================================================
 */
interface IProductCardList {
    title: string
    subtitle: string
    slides: Array<IProductCardProps>
}

/**
 ** ======================================================
 ** Component [ProductCardList]
 ** ======================================================
 */
const ProductCardList = ({ title, subtitle, slides }: IProductCardList) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const [numSlidesToShow, setNumSlidesToShow] = useState(3)

    const theme = useTheme()
    const windowDimensions = useWindowDimensions()

    /*
     ** **
     ** ** ** Methods
     ** **
     */

    //Set no of slides to show on window resize
    useEffect(() => {
        if (windowDimensions.width <= theme.breakpoints.values.sm) {
            setNumSlidesToShow(1)
        } else if (windowDimensions.width <= theme.breakpoints.values.lg) {
            setNumSlidesToShow(2)
        } else setNumSlidesToShow(3)
    }, [windowDimensions])

    return (
        <ProductCardListStyled>
            <Column>
                <Wrapper>
                    <Typography fontFamily="Playfair Display" variant="h5">
                        {subtitle}
                    </Typography>
                </Wrapper>
                <Wrapper>
                    <Typography variant="h3">{title}</Typography>
                </Wrapper>
                <Wrapper>
                    <Button
                        style={{
                            fontWeight: 'bold',
                            borderRadius: '0px',
                            height: '60px',
                        }}
                        size="large"
                        variant={'contained'}
                        color="primary"
                    >
                        Shop Now
                        <ArrowForwardOutlined />
                    </Button>
                </Wrapper>
            </Column>
            <Column>
                <CardSlider
                    showNextPreview={
                        windowDimensions.width > theme.breakpoints.values.sm
                    }
                    slidesToShow={numSlidesToShow}
                    slides={slides}
                />
            </Column>
        </ProductCardListStyled>
    )
}

export default ProductCardList
