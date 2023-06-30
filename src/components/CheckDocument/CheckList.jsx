import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';



const CheckList = ({setVerify,sendVerify}) => {
  const [checked, setChecked] = useState([0]);
  const [isComplete, setIsComplete] = useState(false); // Variable de estado para el estado de completitud

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

useEffect(() => {
    // Verificar si todos los elementos están marcados como completos
    if (checked.length === 5) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [checked]);
  
  const submitValue = (e) => {
    e.preventDefault();
    setVerify(true)
    sendVerify()

  }

  return (
    <Box component='form' onSubmit={submitValue}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {['Identificacion Oficial', 'Comprobante de Domicilio', 'Antecedentes Penales', 'Curp'].map((value) => {
          const labelId = `${value}`;

          return (
            <ListItem
              key={value}
              secondaryAction={
                <IconButton edge="end" aria-label="comments">
                  <CommentIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {checked.length === 5 ? (
  <Button type='submit' variant='outlined' >
    Verificar
  </Button>
) : (
  <Button variant='contained' disabled >Verificar</Button>
)}
      
    </Box>
  );
}

export default CheckList;
