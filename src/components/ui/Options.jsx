import React from 'react'
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

const Options = () => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton aria-label="edit" size="large" color='primary'>
                <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton aria-label="delete" size="large" color='error'>
                <DeleteIcon fontSize="inherit" />
            </IconButton>
        </Stack>
    )
}

export default Options
