import { ArrowBack, Home, Settings } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Error Styled
const ErrorStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    font-size: 10rem;
`

/**
 ** ======================================================
 ** Component [Error404]
 ** ======================================================
 */
const Error404 = () => {
    //Navigation
    const navigate = useNavigate()

    return (
        <ErrorStyled>
            <Settings fontSize="inherit" />
            <Typography variant="h1">Error 404!</Typography>
            <Typography variant="h6">
                Uh oh! Unfortunately the page you're looking for doesn't exist.
            </Typography>
            <Stack flexDirection="row" gap="8px">
                <Button
                    size="large"
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>
                <Button
                    size="large"
                    variant="outlined"
                    startIcon={<Home />}
                    onClick={() => navigate('/')}
                >
                    Home
                </Button>
            </Stack>
        </ErrorStyled>
    )
}

export default Error404
