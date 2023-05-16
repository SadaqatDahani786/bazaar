import { useEffect, useState } from 'react'

import { Alert, AlertTitle } from '@mui/material'

import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'

//Redux
import { getProductAsync, IProduct } from '../../../../store/productReducer'
import { useAppDispatch, useAppSelector } from '../../../../store/store'

//Components
import ProductView from '../ProductView'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
const EditProductStyled = styled.div``

/**
 ** ======================================================
 ** Component [EditProduct]
 ** ======================================================
 */
const EditProduct = () => {
    /**
     ** **
     ** ** ** Styled Components
     ** **
     */
    //Redux
    const error = useAppSelector((state) => state.product.errors.fetch)
    const dispatch = useAppDispatch()

    //State
    const [product, setProduct] = useState<IProduct>()
    const [showAlert, setShowAlert] = useState(false)

    //Hooks
    const [params] = useSearchParams()

    /**
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch product which to be updated
    useEffect(() => {
        //1) Get id from search params
        const id = params.get('id')

        //2) Validate
        if (!id) return

        //3) Dispach action to get product
        dispatch(
            getProductAsync({
                id,
                cb: (prod) => {
                    if (prod) return setProduct(prod)
                    setShowAlert(true)
                },
            })
        )
    }, [])

    return (
        <EditProductStyled>
            {showAlert && error ? (
                <Alert
                    variant="outlined"
                    severity="error"
                    onClose={() => setShowAlert(false)}
                >
                    <AlertTitle>Error Occured!</AlertTitle>
                    Failed to fetch prdoduct which to be updated. ${error}
                </Alert>
            ) : (
                ''
            )}
            <ProductView mode="EDIT" product={product} />
        </EditProductStyled>
    )
}

export default EditProduct
