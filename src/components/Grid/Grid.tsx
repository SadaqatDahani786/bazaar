import { Typography } from '@mui/material'
import styled from 'styled-components'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//Grid
const GridStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(5, 248px);
    grid-auto-rows: repeat(3, 300px);
    gap: 16px;

    ${(props) => props.theme.breakpoints.down('md')} {
        grid-template-columns: repeat(1, 1fr);
    }
`

//Grid Item
const GridItem = styled.div`
    position: relative;
    background: ${(props) => props.theme.palette.primary.dark};
    grid-column: auto / span 4;
    height: 100%;
    postion: relative;
    cursor: pointer;

    &:hover > div {
        background: black;
        color: white;
    }

    ${(props) => props.theme.breakpoints.down('md')} {
        grid-area: auto / auto / auto / auto !important;
    }

    &:nth-child(1) {
        grid-area: 1 / 1 / span 2 / span 6;
    }

    &:nth-child(2) {
        grid-area: 1 / 7 / span 2 / span 3;
    }

    &:nth-child(3) {
        grid-area: 1 / 10 / span 1 / span 3;
    }

    &:nth-child(4) {
        grid-area: 3 / 1 / span 1 / span 3;
    }

    &:nth-child(5) {
        grid-area: 3 / 4 / span 1 / span 6;
    }

    &:nth-child(6) {
        grid-area: 2 / 10 / span 2 / span 3;
    }
`

//Title
const Title = styled.div`
    position: absolute;
    bottom: 16px;
    left: 24px;
    background: white;
    padding: 8px 32px;
    transition: all 0.2s ease-out;
`

//Image
const Image = styled.div`
    width: 100%;
    height: 100%;

    & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

/**
 ** ======================================================
 ** Interface [IGridProps]
 ** ======================================================
 */
interface IGridProps {
    items: Array<{
        name: string
        slug: string
        image: string
    }>
}

/**
 ** ======================================================
 ** Component [Grid]
 ** ======================================================
 */
const Grid = ({ items }: IGridProps) => {
    return (
        <GridStyled>
            {items.map((cat) => (
                <GridItem key={cat.slug}>
                    <Image>
                        <img src={cat.image} />
                    </Image>
                    <Title>
                        <Typography fontWeight="bold" variant="h5">
                            {cat.name}
                        </Typography>
                    </Title>
                </GridItem>
            ))}
        </GridStyled>
    )
}

export default Grid
