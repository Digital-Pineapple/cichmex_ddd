import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import imagen from '../../assets/Images/pulido.jpg'

const UploadImage = () => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        {
             <CardMedia
             component="img"
             height="300"
             image={imagen}
             alt="servicios"
           />
        }
       
        <CardContent>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Elegir imagen
        </Button>
      </CardActions>
    </Card>
  );
}

export default UploadImage
