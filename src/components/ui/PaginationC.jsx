import React from 'react'
import Pagination from '@mui/material/Pagination';
import { Stack } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const themeColor = createTheme({
    palette: {
        primary: {
            main: '#CC3C5C',
        },
    },
});

const PaginationC = (name) => {
    return (
        <>
            {name}
            <ThemeProvider theme={themeColor}>
                <Stack>
                    <Pagination count={10} color="primary" />
                </Stack>
            </ThemeProvider>
        </>
    )
}

export default PaginationC
