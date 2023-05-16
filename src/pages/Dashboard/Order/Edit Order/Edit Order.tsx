import { Alert, AlertTitle } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getOrderAsync, IOrder } from '../../../../store/orderReducer'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import OrderView from '../OrderView'

const EditOrder = () => {
    /**
     ** **
     ** ** ** State
     ** **
     */
    const [order, setOrder] = useState<IOrder>()
    const [showAlert, setShowAlert] = useState(false)
    const [params] = useSearchParams()

    //Redux
    const error = useAppSelector((state) => state.order.errors.fetch)
    const dispatch = useAppDispatch()

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
            getOrderAsync({
                id,
                cb: (order) => {
                    if (order) return setOrder(order)
                    setShowAlert(true)
                },
            })
        )
    }, [])

    return (
        <div>
            {showAlert && error ? (
                <Alert
                    variant="outlined"
                    severity="error"
                    onClose={() => setShowAlert(false)}
                >
                    <AlertTitle>Error Occured!</AlertTitle>
                    Failed to fetch order which to be updated. ${error}
                </Alert>
            ) : (
                ''
            )}
            <OrderView mode="EDIT" order={order} />
        </div>
    )
}

export default EditOrder
