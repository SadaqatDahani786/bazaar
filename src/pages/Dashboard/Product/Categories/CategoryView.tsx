import { useEffect, useRef, useState } from 'react'

import {
    Alert,
    AlertTitle,
    Button,
    CircularProgress,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import {
    createCategoryAsync,
    getManyCategoryAsync,
    updateCategoryAsync,
} from '../../../../store/categoryReducer'
import { IMediaDatabase } from '../../../../store/mediaReducer'
import { ICategory } from '../../../../store/categoryReducer'

//Components
import MediaPicker from '../../../../components/MediaPicker'

//Hooks & Func
import useInput from '../../../../hooks/useInput'
import {
    combineValidators,
    isAlpha,
    isAlphaNumeric,
    isEmpty,
} from '../../../../utils/validators'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//Category View
const CategoryViewStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
`

/*
 ** ======================================================
 ** Component [CategoryView]
 ** ======================================================
 */
const CategoryView = ({
    mode = 'ADD_NEW',
    categoryId,
}: {
    mode?: 'EDIT' | 'ADD_NEW'
    categoryId?: string
}) => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    //Redux
    const categories = useAppSelector((state) => state.category.data)
    const isLoading = useAppSelector((state) => state.category.isLoading)
    const errors = useAppSelector((state) => state.category.errors)
    const dispatch = useAppDispatch()

    //States
    const [category, setCategory] = useState<ICategory>()
    const [selectedFiles, setSelectedFiles] = useState<Array<IMediaDatabase>>(
        []
    )
    const [selectedParentCat, setSelectedParentCat] = useState('none')
    const [showAlert, setShowAlert] = useState(false)

    //refs
    const refInputName = useRef<HTMLInputElement>(null)
    const refInputSlug = useRef<HTMLInputElement>(null)
    const refInputDescription = useRef<HTMLInputElement>(null)

    const clearFunc = useRef<() => void>()

    /*
     ** **
     ** ** ** Form Fiels
     ** **
     */
    //Name
    const inputName = useInput({
        default_value: category?.name || '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'What category should be called? give it name.',
            },
            {
                validator: isAlpha,
                message: 'A category name must only use letters or spaces.',
                options: {
                    ignoreCase: true,
                    ignoreSpaces: true,
                },
            },
        ]),
    })

    //Slug
    const inputSlug = useInput({
        default_value:
            category?.name && !inputName.validation.touched
                ? category.name
                : inputName.value.split(' ').join('-').toLowerCase(),
        validation: combineValidators([
            {
                validator: isEmpty,
                message:
                    'Please enter a slug for your category that must be unique.',
            },
            {
                validator: isAlpha,
                message:
                    'A category slug must only use lowercase letters or hyphens for spaces only.',
                options: {
                    ignoreHyphens: true,
                },
            },
        ]),
    })

    //Description
    const inputDescription = useInput({
        default_value: category?.description || '',
        validation: combineValidators([
            {
                validator: isEmpty,
                message: 'Describe your category in great details.',
            },
            {
                validator: isAlphaNumeric,
                message:
                    'A category description can use letters, numbers and puntuation marks, no other special characters are allowed.',
                options: {
                    ignoreSpaces: true,
                    ignorePunctuations: true,
                    ignoreCase: true,
                },
            },
        ]),
    })

    /*
     ** **
     ** ** ** Side effects
     ** **
     */
    //Fetch categories
    useEffect(() => {
        //1) Don't request, if already fetched
        if (categories.length > 0) return

        //2) Dispatch action to fetch categories
        dispatch(getManyCategoryAsync())
    }, [])

    //Set category which to be updated
    useEffect(() => {
        //1) Find category to be updated in mode "EDIT"
        setCategory(categories.find((cat) => cat._id === categoryId))
    }, [categories])

    //Set selected parent category
    useEffect(() => {
        //2) Set partent
        if (!category?.parent?._id) return
        setSelectedParentCat(category.parent._id)
    }, [category])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click add new category
    const clickAddNewCateogry = () => {
        //1) Hide alert
        setShowAlert(false)

        //2) Tigger validation
        inputName.validation.validate()
        inputSlug.validation.validate()
        inputDescription.validation.validate()

        //3) Focus on invalid inptu fields
        if (inputName.validation.error || !inputName.validation.touched)
            return refInputName.current?.focus()
        else if (inputSlug.validation.error || !inputSlug.validation.touched)
            return refInputSlug.current?.focus()
        else if (
            inputDescription.validation.error ||
            !inputDescription.validation.touched
        )
            return refInputDescription.current?.focus()

        //4) No errors, proceed with creating form data
        const formData = new FormData()

        formData.append('name', inputName.value)
        formData.append('slug', inputSlug.value)
        formData.append('description', inputDescription.value)
        selectedParentCat !== 'none' &&
            formData.append('parent', selectedParentCat)
        selectedFiles.length > 0 &&
            formData.append('image', selectedFiles[0]._id)

        //5) Dispatch action to create a new cateogry
        if (mode === 'ADD_NEW')
            return dispatch(
                createCategoryAsync({
                    formData,
                    cb: () => {
                        clickResetHandler()
                        setShowAlert(true)
                    },
                })
            )

        //6) Dispatch action to update category
        dispatch(
            updateCategoryAsync({
                id: categoryId as string,
                formData,
                cb: () => {
                    clickResetHandler()
                    setShowAlert(true)
                },
            })
        )
    }

    //Click reset handler
    const clickResetHandler = () => {
        //=> Reset inputs
        inputName.reset(false)
        inputSlug.reset(false)
        inputDescription.reset(false)

        //=> Reset data
        setCategory(undefined)
        setSelectedParentCat('none')

        //=> Clear func
        clearFunc.current && clearFunc.current()
    }

    //Pass reset function to parent component
    const onClearSelection = (cb: () => void) => {
        clearFunc.current = cb
    }

    return (
        <CategoryViewStyled>
            {showAlert && (!isLoading.create || !isLoading.update) ? (
                <Alert
                    sx={{ textAlign: 'left' }}
                    variant="outlined"
                    severity={
                        errors.create || errors.update ? 'error' : 'success'
                    }
                    onClose={() => setShowAlert(false)}
                >
                    <AlertTitle>
                        {errors.create ? 'Error Occured!' : 'Success'}
                    </AlertTitle>
                    {errors.create
                        ? errors.create || errors.update
                        : `Category has been ${
                              mode === 'EDIT' ? 'updated' : 'created'
                          } successfully.`}
                </Alert>
            ) : (
                ''
            )}
            <Stack gap="16px">
                <Stack flexDirection="row" gap="16px">
                    <Stack flex={1}>
                        <TextField
                            label="Name"
                            value={inputName.value}
                            onChange={inputName.onChangeHandler}
                            onBlur={inputName.onBlurHandler}
                            error={inputName.validation.error}
                            helperText={inputName.validation.message}
                            inputRef={refInputName}
                            fullWidth
                        />
                    </Stack>
                    <Stack flex={1}>
                        <TextField
                            label="Slug"
                            value={inputSlug.value}
                            onChange={inputSlug.onChangeHandler}
                            onBlur={inputSlug.onBlurHandler}
                            error={inputSlug.validation.error}
                            helperText={inputSlug.validation.message}
                            inputRef={refInputSlug}
                            fullWidth
                        />
                    </Stack>
                </Stack>
                <Stack>
                    <TextField
                        label="Description"
                        value={inputDescription.value}
                        onChange={inputDescription.onChangeHandler}
                        onBlur={inputDescription.onBlurHandler}
                        error={inputDescription.validation.error}
                        helperText={inputDescription.validation.message}
                        inputRef={refInputDescription}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Stack>
                <Stack flexDirection="row" gap="8px">
                    <Stack flex={1}>
                        <TextField
                            label="Parent Category"
                            value={selectedParentCat}
                            fullWidth
                            select
                            onChange={(e) =>
                                setSelectedParentCat(e.target.value)
                            }
                        >
                            <MenuItem value="none">None</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <Stack flex={1}>
                        <MediaPicker
                            default_selected={
                                mode === 'EDIT' && category?.image
                                    ? [category.image]
                                    : []
                            }
                            buttonText="Set Category Image"
                            onClearSelection={onClearSelection}
                            onSelect={(files) => setSelectedFiles(files)}
                        />
                    </Stack>
                </Stack>
            </Stack>
            <Stack flexDirection="row" gap="16px">
                <Button
                    size="large"
                    variant="contained"
                    disableElevation={true}
                    onClick={clickAddNewCateogry}
                    disabled={
                        mode === 'EDIT' ? isLoading.update : isLoading.create
                    }
                >
                    {isLoading.create || isLoading.update ? (
                        <CircularProgress size={16} />
                    ) : mode === 'EDIT' ? (
                        'Update category'
                    ) : (
                        'Add new category'
                    )}
                </Button>
                <Button
                    size="large"
                    variant="outlined"
                    onClick={clickResetHandler}
                >
                    Clear fields
                </Button>
            </Stack>
        </CategoryViewStyled>
    )
}

export default CategoryView
