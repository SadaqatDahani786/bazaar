import { Alert, AlertTitle } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { getProductAsync, IProduct } from '../../../../store/productReducer'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import ProductView from '../ProductView'

const EditProductStyled = styled.div``

const EditProduct = () => {
    //State & Hooks
    const [product, setProduct] = useState<IProduct>()
    const [showAlert, setShowAlert] = useState(false)
    const [params] = useSearchParams()
    const error = useAppSelector((state) => state.product.errors.fetch)
    const dispatch = useAppDispatch()

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
