import styled from 'styled-components'
import { UploadMediaView } from '../../../../components/MediaPicker'

/**
 ** **
 ** ** ** Styled Components
 ** **
 */
//AddNewMedia Styled
const AddNewMediaStyled = styled.div`
    padding: 80px 0;
`

/** ======================================================
 ** Component [AddNewMedia]
 ** ======================================================
 */
const AddNewMedia = () => {
    return (
        <AddNewMediaStyled>
            <UploadMediaView />
        </AddNewMediaStyled>
    )
}

export default AddNewMedia
