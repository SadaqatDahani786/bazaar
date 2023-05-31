import { useEffect } from 'react'

import { AddOutlined } from '@mui/icons-material'
import {
    Stack,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@mui/material'

import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

//Components
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//FAQ Styled
const FAQStyled = styled.div`
    width: 100%;
    min-height: 80%;
    padding: 80px 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 80px;
    text-align: left;
`

/**
 ** ======================================================
 ** Component [FAQ]
 ** ======================================================
 */
const FAQ = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //locations
    const location = useLocation()

    //Scroll to top
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [location.pathname])

    return (
        <>
            <Header />
            <FAQStyled>
                <Typography variant="h3">Frequently Asked Questions</Typography>
                <Stack flexDirection="row" gap="16px">
                    <Stack flex={1}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<AddOutlined />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    Can I pay with cash on delivery?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Yes, we offer cash on delivery as an option
                                    on checkout for easiness of our customer.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<AddOutlined />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    How long does it take for my order to get
                                    delivered?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Well it depends where you live, but usually
                                    it takes 5-6 days for your order to get
                                    delivered at your doorstep.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<AddOutlined />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    Is delivery free when I place an order?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    No, unfortunately we don't offer free
                                    delivery and the charges will be included in
                                    the final price at the checkout.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<AddOutlined />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    What happens if I forgot my account
                                    password?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    No worries, this happens from time to time.
                                    Just go to login page and check forgot
                                    password and enter your email to send a
                                    password reset link to that address.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                    <Stack flex={1}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<AddOutlined />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    Can I return an order after recieving an
                                    item?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Yes you can, we have a 15 days return policy
                                    with full refund, if you're not satisfied
                                    with the product or our services.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<AddOutlined />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    Does change of mind applicable as a valid
                                    reason to return an order?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    No, change of mind doesn't applicable, but
                                    you can return an order if it's damaged,
                                    faulty or a item you recieved was different.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<AddOutlined />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    Is your website secure for online payment?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Yes, we deeply care about the security and
                                    keep our site up-sto-date, in addition we
                                    don't store any card details, store password
                                    as encrypted hashes in our database, and use
                                    a very robust payment gateway like Strip for
                                    online transactions on our website.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<AddOutlined />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    How to contact us?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Send an email to us, visit our contact us
                                    page to get more info or reach out to us on
                                    our social medias.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </Stack>
            </FAQStyled>
            <Footer />
        </>
    )
}

export default FAQ
