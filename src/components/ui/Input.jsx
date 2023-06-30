import { TextField } from '@mui/material';

const Input = ({name, label, value, onChange, error, helperText, type = "text"}) => {
    return (
        <TextField
            margin="normal"
            required
            fullWidth
            id={name}
            label={label}
            name={name}
            autoFocus
            value={value}
            type={type}
            onChange={onChange}
            error={error}
            helperText={helperText}
        />
    )
}

export default Input