import { Dna } from 'react-loader-spinner'

import React from 'react'
import { Box, CssBaseline } from '@mui/material'

const LoadingScreen = () => {
    return (
        <Box sx={{
            width: '100%', zIndex: 99, position: 'fixed', display: 'flex', height: '100%',
            alignItems: 'center', justifyContent: 'center', bgcolor: 'rgb(21, 21, 21)', flexDirection: 'column'
        }}>
            <CssBaseline />
            <Dna
                visible={true}
                height="250"
                width="250"
                ariaLabel="dna-loading"
                wrapperClass="dna-wrapper"
            />
        </Box>
    )
}

export default LoadingScreen