import { Link, Typography, Stack } from '@mui/material'
import { Home, Warning } from '@mui/icons-material'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

/**
 ** ======================================================
 ** Interface [Props]
 ** ======================================================
 */
interface Props {
    children: ReactNode
}

/**
 ** ======================================================
 ** Interface [State]
 ** ======================================================
 */
interface State {
    hasError: boolean
    error?: Error
}

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
const ErrorBoundaryStyled = styled.div`
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
 ** Component [ErrorBoundary]
 ** ======================================================
 */
class ErrorBoundary extends Component<Props, State> {
    //State
    public state: State = {
        hasError: false,
    }

    //Error
    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error }
    }

    //Catch error
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    //Render UI
    public render() {
        if (this.state.hasError) {
            return (
                <ErrorBoundaryStyled>
                    <Stack flexDirection="row" alignItems="center" gap="16px">
                        <Warning fontSize="inherit" />
                        <Typography variant="h1">Oops!</Typography>
                    </Stack>
                    <Typography variant="h4">
                        Sorry there was an error occurred.
                    </Typography>
                    <Typography variant="h6">
                        {this.state.error?.message}
                    </Typography>

                    <Typography>
                        Go back{' '}
                        <Link
                            fontSize="inherit"
                            component={RouterLink}
                            to="/"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Home color="primary" fontSize="inherit" />
                            Home
                        </Link>{' '}
                        and try again. If error persists, please contact site
                        administrator.
                    </Typography>
                </ErrorBoundaryStyled>
            )
        }

        return this.props.children
    }
}

//Export
export default ErrorBoundary
