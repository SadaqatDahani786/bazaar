import { Typography, useTheme } from '@mui/material'
import styled from 'styled-components'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Product Card
const ProductCardStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

//Product Card Image
const ProductCardImage = styled.div`
    width: 100%;
    flex: 1;
    overflow: hidden;
    position: relative;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

//Price Card Details
const ProductCardDetails = styled.div`
    width: 100%;
    flex: 0 0 140px;
    text-align: left;
    padding: 16px 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 16px 0;
    }
`

//Wrapper
const Wrapper = styled.div`
    display: flex;
    gap: 8px;
`

//Color Circle
const ColorCircle = styled.div`
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 100%;
    border: 2px solid ${(props) => props.theme.palette.primary.main};
`

//Tag Wrapper
const TagWrapper = styled.div`
    position: absolute;
    bottom: 0;
    padding: 8px;
    width: 100%;
    height: max-content;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`

//Tag
const Tag = styled.div`
    background: ${(props) => props.theme.palette.error.main};
    color: ${(props) => props.theme.palette.secondary.main};
    font-size: 1.2rem;
    padding: 0 16px;
    font-weight: bold;
`

//Staff Picked Tag
const StaffPickedTag = styled.div`
    width: 12.6rem;
    height: 2.6rem;
    font-size: 0.8rem;
    background: ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.palette.secondary.main};
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    clip-path: polygon(5% 0px, 100% 0px, 100% 100%, 29.52% 98.3%);

    & > span {
        margin-left: 48px;
    }
`

/**
 ** ======================================================
 ** Interface [IProductCardProps]
 ** ======================================================
 */
export interface IProductCardProps {
    title?: string
    image: string
    prices?: {
        price: number
        sale_price?: number
    }
    isStaffPicked?: boolean
    colors?: Array<string>
}

/**
 ** ======================================================
 ** Component [ProductCard]
 ** ======================================================
 */
const ProductCard = ({
    title,
    prices,
    image,
    isStaffPicked = false,
    colors = [],
}: IProductCardProps) => {
    //Hooks
    const theme = useTheme()

    return (
        <ProductCardStyled>
            <ProductCardImage>
                {isStaffPicked ? (
                    <StaffPickedTag>
                        <span>Staff Picked</span>
                    </StaffPickedTag>
                ) : (
                    ''
                )}
                <img src={image} />
                <TagWrapper>
                    {prices?.sale_price ? <Tag>Sale</Tag> : ''}
                </TagWrapper>
            </ProductCardImage>
            {title ? (
                <ProductCardDetails>
                    <Typography
                        style={{
                            lineHeight: '1.2em',
                            maxHeight: '2.4em',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                        fontWeight={600}
                        variant="h5"
                    >
                        {title}
                    </Typography>
                    <Wrapper>
                        <Typography
                            style={{ display: 'flex', alignItems: 'center' }}
                            variant="h5"
                        >
                            $
                            {prices?.sale_price
                                ? prices.sale_price
                                : prices?.price}
                        </Typography>
                        {prices?.sale_price ? (
                            <Typography
                                style={{
                                    textDecoration: 'line-through',
                                    color: theme.palette.grey[600],
                                }}
                                variant="h6"
                            >
                                ${prices?.price}
                            </Typography>
                        ) : (
                            ''
                        )}
                    </Wrapper>
                    <Wrapper>
                        {colors.map((color, ind) => (
                            <ColorCircle
                                key={ind}
                                style={{ background: color }}
                            />
                        ))}
                    </Wrapper>
                </ProductCardDetails>
            ) : (
                ''
            )}
        </ProductCardStyled>
    )
}

export default ProductCard
