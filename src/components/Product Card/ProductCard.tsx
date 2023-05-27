import { PhotoAlbumOutlined } from '@mui/icons-material'
import { Link, Tooltip, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import Pill from '../Pill'

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
    background: ${(props) => props.theme.palette.grey[300]};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10rem;

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
    align-items: center;
    gap: 8px;
`

//Color Circle
const ColorCircle = styled.div`
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 100%;
    border: 1px solid ${(props) => props.theme.palette.primary.main};
`

//Tag Wrapper
const TagWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 8px;
    width: 100%;
    height: max-content;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`

// //Tag
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
    url?: string
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
    url = '',
    colors = [],
}: IProductCardProps) => {
    //Hooks
    const theme = useTheme()

    return (
        <ProductCardStyled>
            <ProductCardImage>
                <Link component={RouterLink} to={url}>
                    {isStaffPicked ? (
                        <StaffPickedTag>
                            <span>Staff Picked</span>
                        </StaffPickedTag>
                    ) : (
                        ''
                    )}
                    {image ? (
                        <img src={image} crossOrigin="anonymous" />
                    ) : (
                        <PhotoAlbumOutlined
                            fontSize="inherit"
                            color="secondary"
                        />
                    )}
                    <TagWrapper>
                        {prices?.sale_price ? <Tag>Sale</Tag> : ''}
                    </TagWrapper>
                </Link>
            </ProductCardImage>

            {title ? (
                <ProductCardDetails>
                    <Link underline="hover" component={RouterLink} to={url}>
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
                    </Link>
                    <Wrapper>
                        <Typography
                            style={{ display: 'flex', alignItems: 'center' }}
                            variant="h5"
                        >
                            &euro;
                            {(prices?.sale_price
                                ? prices.sale_price
                                : prices?.price
                            )?.toFixed(2)}
                        </Typography>
                        {prices?.sale_price ? (
                            <Typography
                                style={{
                                    textDecoration: 'line-through',
                                    color: theme.palette.grey[600],
                                }}
                                variant="h6"
                            >
                                &euro;{prices?.price.toFixed(2)}
                            </Typography>
                        ) : (
                            ''
                        )}
                    </Wrapper>
                    <Wrapper>
                        <Typography>Colors: </Typography>
                        {colors.length <= 0
                            ? 'No options available.'
                            : colors.map((color, ind) => (
                                  <Tooltip key={ind} title={color}>
                                      <ColorCircle
                                          style={{
                                              background: color,
                                              cursor: 'pointer',
                                          }}
                                      />
                                  </Tooltip>
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
