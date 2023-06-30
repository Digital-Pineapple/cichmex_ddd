import * as React from 'react';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const UploadFile = () => {
    return (
        <Button variant="contained" component="label" size='large'  startIcon={<UploadFileIcon sx={{ fontSize: 20 }} />}>
            Cargar archivo
            <input hidden accept=".doc,.docx,.xml,.pdf" multiple type="file"/>
        </Button>
    )
}

export default UploadFile
