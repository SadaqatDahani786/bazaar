import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react'

import { DeleteOutline, SearchOutlined } from '@mui/icons-material'
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    CircularProgress,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'

import styled from 'styled-components'

//Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import {
    deleteUserAsync,
    editSelectedStatus,
    getManyUserAsync,
    searchUserAsync,
} from '../../../../store/userReducer'
import { useNavigate } from 'react-router-dom'

/*
 ** **
 ** ** ** Styled Components
 ** **
 */
//All Customers
const AllCustomersStyled = styled.div`
    padding: 32px 0;
`

//Control Bar
const ControlBar = styled.div`
    width: 100%;
    height: 80px;
    background: ${(props) => props.theme.palette.grey['300']};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    padding: 16px;
`

//Widget
const Widget = styled.div`
    width: 100%;
    min-height: 400px;
    border: 1px solid black;
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 32px;
    text-align: left;
    padding: 24px;
`

/**
 ** ======================================================
 ** Componet Slice [User]
 ** ======================================================
 */
const AllCustomers = () => {
    /*
     ** **
     ** ** ** State & Hooks
     ** **
     */
    const users = useAppSelector((state) => state.user.data)
    const isLoading = useAppSelector((state) => state.user.isLoading)
    const dispatch = useAppDispatch()

    const [toBeDeletedUser, setToBeDeletedUser] = useState<string | undefined>()
    const timeOutID = useRef<{ id: ReturnType<typeof setTimeout> | null }>({
        id: null,
    })

    const navigate = useNavigate()

    //Fetch users on load
    useEffect(() => {
        dispatch(getManyUserAsync())
    }, [])

    /*
     ** **
     ** ** ** Methods
     ** **
     */
    //Click select handler
    const clickSelectHandler = (id: string) => {
        dispatch(editSelectedStatus({ ids: [id] }))
    }

    //Click selete all handler
    const clickSelectAllHandler = () => {
        //1) Determine state
        const state = users.every((user) => !user.isSelected)

        //2) Dispatch action
        dispatch(
            editSelectedStatus({
                ids: users.map((user) => user._id),
                edit: state,
            })
        )
    }

    //Click delete selected handler
    const clickDeleteSelectedHandler = () => {
        //1) Get ids of selected users
        const ids = users
            .filter((user) => user.isSelected)
            .map((user) => user._id)

        //2) Dispatch action to delete users
        dispatch(deleteUserAsync({ ids }))
    }

    //Click delete handler
    const clickDeleteHandler = (e: SyntheticEvent<HTMLButtonElement>) => {
        //1) Get ids of selected users
        const id = e.currentTarget.dataset.id

        //2) Validate
        if (!id) return

        //3) Set id of user to to be deleted
        setToBeDeletedUser(id)

        //3) Dispatch action to delete users
        dispatch(
            deleteUserAsync({
                ids: [id],
                cb: () => setToBeDeletedUser(undefined),
            })
        )
    }

    //On search input change handler
    const onSearchInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        //1) Get query
        const query = e.currentTarget.value

        //2) Clear previously set timeout if there's any
        if (timeOutID.current.id) clearTimeout(timeOutID.current.id)

        //3) Refetch users when query empty again
        if (!query || query.length <= 0) {
            return dispatch(getManyUserAsync())
        }

        //4) Set timeout to fetch user via search query
        timeOutID.current.id = setTimeout(() => {
            dispatch(searchUserAsync(query))
        }, 300)
    }

    return (
        <AllCustomersStyled>
            <ControlBar>
                <Box>
                    <TextField
                        type="search"
                        placeholder="Search here"
                        color="primary"
                        variant="standard"
                        onChange={onSearchInputChangeHandler}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlined />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        marginLeft: 'auto',
                        display: 'flex',
                        gap: '16px',
                    }}
                >
                    <Button
                        sx={{ width: '12.6rem' }}
                        size="large"
                        variant="contained"
                        color="secondary"
                        disabled={users.every((user) => !user.isSelected)}
                        disableElevation={true}
                        startIcon={!isLoading.delete && <DeleteOutline />}
                        onClick={clickDeleteSelectedHandler}
                    >
                        {isLoading.delete ? (
                            <CircularProgress size={24} />
                        ) : (
                            'Delete Selected'
                        )}
                    </Button>
                </Box>
            </ControlBar>
            <Widget>
                <Typography variant="h5">Customers</Typography>
                <Table
                    sx={{ minWidth: 650, overflowY: 'scroll' }}
                    aria-label="customers table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={
                                        users.filter((user) => user.isSelected)
                                            .length > 0 &&
                                        users.filter((user) => user.isSelected)
                                            .length < users.length
                                    }
                                    checked={
                                        users.filter((user) => user.isSelected)
                                            .length > 0 &&
                                        users.filter((user) => user.isSelected)
                                            .length === users.length
                                    }
                                    onChange={clickSelectAllHandler}
                                    inputProps={{
                                        'aria-label': 'select all customers',
                                    }}
                                />
                            </TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell align="right">Username</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Country</TableCell>
                            <TableCell align="right">Role</TableCell>
                            <TableCell align="right">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading.fetch ? (
                            <TableRow>
                                <TableCell
                                    sx={{ textAlign: 'center' }}
                                    colSpan={7}
                                >
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : users.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Typography variant="h6">
                                        Uh oh, no customers found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow
                                    key={user._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={user.isSelected}
                                            onChange={() =>
                                                clickSelectHandler(user._id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap="8px"
                                        >
                                            <Avatar>
                                                <img
                                                    style={{
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                    src={user.photo?.url}
                                                    crossOrigin="anonymous"
                                                />
                                            </Avatar>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                {user.name}
                                                <ButtonGroup
                                                    variant="text"
                                                    size="small"
                                                >
                                                    <Button
                                                        data-id={user._id}
                                                        onClick={(e) =>
                                                            navigate(
                                                                `/dashboard/edit-customer?id=${e.currentTarget.dataset.id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        data-id={user._id}
                                                        onClick={
                                                            clickDeleteHandler
                                                        }
                                                    >
                                                        {isLoading.delete &&
                                                        toBeDeletedUser ===
                                                            user._id ? (
                                                            <CircularProgress
                                                                size={16}
                                                            />
                                                        ) : (
                                                            'Delete'
                                                        )}
                                                    </Button>
                                                </ButtonGroup>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.username}
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.email}
                                    </TableCell>
                                    <TableCell align="right">
                                        {user?.addresses.find(
                                            (address) =>
                                                address.default_billing_address
                                        )?.country || '-- --'}
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.role.toUpperCase()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {new Date(
                                            user.created_at
                                        ).toDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Widget>
        </AllCustomersStyled>
    )
}

export default AllCustomers
