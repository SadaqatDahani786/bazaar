import styled from 'styled-components'
import OrderView from '../OrderView'

const AddNewOrderStyled = styled.div`
    /* padding: 32px 0; */
`

const AddNewOrder = () => {
    return (
        <AddNewOrderStyled>
            <OrderView />
        </AddNewOrderStyled>
    )
}

export default AddNewOrder
