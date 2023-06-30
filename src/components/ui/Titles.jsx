import { Divider } from '@mui/material'
import React from 'react'


const Titles = ({ name }) => {
    return (
        <div>
            {name}
            <Divider color="#FF0000" sx={{ borderBottomWidth: 3 }} />
        </div>
    )
}

export default Titles
