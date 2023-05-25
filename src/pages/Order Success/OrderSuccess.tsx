import { CheckCircleOutline } from '@mui/icons-material'
import { Button, Typography, Box, Stack } from '@mui/material'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

//Components
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Order Success
const OrderSuccessStyled = styled.div`
    width: 100%;
`

//Section
const Section = styled.section`
    padding: 80px 48px;
`

/**
 ** ======================================================
 ** Component [OrderSuccess]
 ** ======================================================
 */
const OrderSuccess = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const navigate = useNavigate()

    return (
        <OrderSuccessStyled>
            <Header />
            <Section>
                <Stack alignItems="center" gap="24px">
                    <CheckCircleOutline
                        color="success"
                        sx={{ fontSize: '8rem' }}
                    />
                    <Typography variant="h2">
                        Thank You For Your Purchase!
                    </Typography>
                    <Typography variant="h6">
                        Your order has been placed, thank you for shopping with
                        us.
                    </Typography>
                    <Box>
                        <Button
                            variant="contained"
                            disableElevation
                            size="large"
                            sx={{ padding: '16px 24px' }}
                            onClick={() => navigate('/')}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                </Stack>
            </Section>
            <Footer />
        </OrderSuccessStyled>
    )
}

export default OrderSuccess
