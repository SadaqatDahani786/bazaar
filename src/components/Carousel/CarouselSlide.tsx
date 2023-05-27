import { Button, Link, Typography } from '@mui/material'
import { ArrowForwardOutlined, AddOutlined } from '@mui/icons-material'
import styled from 'styled-components'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Slide Text Wrapper
const SlideTextWrapper = styled.div<ICarouselSlideProps>`
    position: absolute;
    z-index: 50;
    display: flex;
    flex-direction: column;
    left: ${(props) => (props.variant === 'small' ? '50%' : '48px')};

    ${(props) => props.theme.breakpoints.down('md')} {
        left: 8px;
        bottom: 8px !important;
        transform: none !important;
    }
`

//Wrapper
const Wrapper = styled.div<ICarouselSlideProps>`
    margin: 8px 0;
    padding: 8px 0;
    text-align: left;
    width: ${(props) => (props.variant === 'small' ? 'max-content' : '460px')};
    align-self: ${(props) =>
        props.variant === 'small' ? 'center' : 'flex-start'};

    ${(props) => props.theme.breakpoints.down('md')} {
        width: ${(props) => (props.variant === 'small' ? '100%' : '60%')};
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
        width: ${(props) => (props.variant === 'small' ? '100%' : '90%')};
    }

    & > h3 > span:nth-child(1),
    & > h4 > span:nth-child(1) {
        font-style: italic;
        color: ${(props) => props.theme.palette.error.main};
    }

    & > h3 > span:nth-child(2),
    & > h4 > span:nth-child(2) {
        font-weight: bold;
    }
`
/**
 ** ======================================================
 ** Inteface [ICarouselSlideProps]
 ** ======================================================
 */
interface ICarouselSlideProps {
    variant?: 'full' | 'mini' | 'small'
    title?: string
    subtitle?: string
    image?: string
    url?: string
}

/**
 ** ======================================================
 ** Component [CarouselSlide]
 ** ======================================================
 */
const CarouselSlide = ({
    variant = 'full',
    title,
    subtitle,
    image,
    url = '',
}: ICarouselSlideProps) => {
    //Navigation
    const navigate = useNavigate()

    return (
        <>
            <img src={image} />
            <SlideTextWrapper
                variant={variant}
                style={{
                    bottom: variant === 'small' ? '50%' : '140px',
                    transform: `translate(${
                        variant === 'small' ? '-50%, 50%' : '0, 0'
                    })`,
                }}
            >
                <Wrapper>
                    {variant === 'full' || variant === 'mini' ? (
                        <Typography
                            fontFamily={'Playfair Display'}
                            variant="h5"
                            color="secondary"
                        >
                            {subtitle}
                        </Typography>
                    ) : (
                        ''
                    )}
                </Wrapper>
                <Wrapper variant={variant}>
                    <Typography
                        variant={variant === 'full' ? 'h3' : 'h4'}
                        color="secondary"
                    >
                        {new String(title)
                            ?.replace(/\*\*(.+?)\*\*/g, '<span>**$1<span>')
                            .split('<span>')
                            .map((word, i) =>
                                word.startsWith('**') ? (
                                    <span key={i}>
                                        {word.replace('**', '')}
                                    </span>
                                ) : (
                                    word
                                )
                            )}
                    </Typography>
                </Wrapper>
                <Wrapper variant={variant}>
                    {variant === 'full' ? (
                        <Button
                            style={{
                                fontWeight: 'bold',
                                borderRadius: '0px',
                            }}
                            size="large"
                            variant={'contained'}
                            color="secondary"
                            onClick={() => navigate(url)}
                        >
                            Shop Now
                            <ArrowForwardOutlined />
                        </Button>
                    ) : (
                        <Link
                            component={RouterLink}
                            to={url}
                            underline="hover"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            variant="subtitle1"
                            color="secondary"
                        >
                            {variant === 'mini' ? 'Explore' : 'Shop Now'}
                            {variant === 'mini' ? (
                                <AddOutlined
                                    style={{ marginLeft: '8px' }}
                                    fontSize="small"
                                />
                            ) : (
                                <ArrowForwardOutlined
                                    style={{ marginLeft: '8px' }}
                                    fontSize="small"
                                />
                            )}
                        </Link>
                    )}
                </Wrapper>
            </SlideTextWrapper>
        </>
    )
}

export default CarouselSlide
